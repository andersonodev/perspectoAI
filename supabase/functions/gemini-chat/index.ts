
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      message, 
      assistantId, 
      sessionId, 
      conversationHistory = [],
      learningProfile = null,
      isCommand = false,
      isPracticeMode = false,
      isActivityGeneration = false 
    } = await req.json();

    console.log('Processing request:', { message, assistantId, sessionId, isCommand, isPracticeMode, isActivityGeneration });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get assistant details
    const { data: assistant, error: assistantError } = await supabase
      .from('ai_assistants')
      .select('*')
      .eq('id', assistantId)
      .single();

    if (assistantError || !assistant) {
      throw new Error('Assistant not found');
    }

    // Get assistant knowledge
    const { data: knowledge } = await supabase
      .from('assistant_knowledge')
      .select('*')
      .eq('assistant_id', assistantId);

    // Build context from knowledge base
    const knowledgeContext = knowledge?.map(k => `${k.title}: ${k.content}`).join('\n\n') || '';

    // Build adaptive personality prompt based on learning profile
    let personalityPrompt = `Você é ${assistant.name}, um assistente de IA especializado em ${assistant.subject}.`;
    
    if (assistant.personality === 'friendly') {
      personalityPrompt += ' Seja caloroso, encorajador e use linguagem acessível.';
    } else if (assistant.personality === 'formal') {
      personalityPrompt += ' Mantenha um tom profissional e direto.';
    } else if (assistant.personality === 'socratic') {
      personalityPrompt += ' Use o método socrático, fazendo perguntas que guiem o aluno ao entendimento.';
    } else if (assistant.personality === 'creative') {
      personalityPrompt += ' Use analogias criativas, metáforas e exemplos divertidos.';
    }

    // Adaptive learning enhancements
    if (learningProfile) {
      if (learningProfile.preferences?.includes('examples')) {
        personalityPrompt += ' O aluno aprende melhor com exemplos práticos.';
      }
      if (learningProfile.preferences?.includes('analogies')) {
        personalityPrompt += ' Use analogias e metáforas para explicar conceitos.';
      }
      personalityPrompt += ` Ajuste seu ritmo para: ${learningProfile.pace}.`;
    }

    // Special modes
    if (isPracticeMode) {
      personalityPrompt += `
        MODO PRÁTICA ATIVADO: Gere exercícios práticos com:
        1. Uma pergunta desafiadora mas adequada ao nível
        2. Dicas progressivas se necessário
        3. Explicação detalhada da solução
        4. Contexto de aplicação prática
        Formate em markdown para melhor visualização.`;
    }

    if (isActivityGeneration) {
      personalityPrompt += `
        GERAÇÃO DE ATIVIDADE: Crie uma atividade educacional completa:
        1. Objetivo de aprendizagem claro
        2. Instruções passo a passo
        3. Exercícios variados (múltipla escolha, dissertativa, prática)
        4. Rubrica de avaliação
        5. Recursos adicionais recomendados
        Formate em markdown para fácil leitura.`;
    }

    if (isCommand) {
      personalityPrompt += ' Esta é uma solicitação de comando especial (resumo, análise, etc). Responda de forma estruturada e completa.';
    }

    // Add behavioral instructions
    if (assistant.guardrails?.instructions) {
      personalityPrompt += `\n\nInstruções específicas: ${assistant.guardrails.instructions}`;
    }

    // Prepare conversation history
    const historyText = conversationHistory
      .map((msg: any) => `${msg.role === 'user' ? 'Aluno' : 'Assistente'}: ${msg.content}`)
      .join('\n');

    const systemPrompt = `${personalityPrompt}

Base de Conhecimento:
${knowledgeContext}

Instruções importantes:
- Use a base de conhecimento para responder perguntas
- Se não souber algo, diga claramente "Não tenho essa informação no meu material" e sugira onde o aluno pode buscar
- Sempre formate sua resposta usando markdown quando apropriado (listas, negrito, etc.)
- Seja preciso e educativo
- Incentive o pensamento crítico
- Se detectar uma dúvida comum, sugira tópicos relacionados

Histórico da conversa:
${historyText}`;

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nPergunta do aluno: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini response:', data);

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    // Generate intelligent suggestions based on the response and context
    let suggestions: string[] = [];
    
    if (!isCommand && !isActivityGeneration) {
      // Basic suggestions
      suggestions = [
        'Pode dar um exemplo prático?',
        'Como isso se aplica no dia a dia?',
        'Tem algum exercício sobre isso?'
      ];

      // Context-aware suggestions
      if (aiResponse.includes('conceito') || aiResponse.includes('definição')) {
        suggestions.push('Pode explicar de forma mais simples?');
      }
      
      if (aiResponse.includes('fórmula') || aiResponse.includes('cálculo')) {
        suggestions.push('Vamos praticar com um problema?');
      }

      if (assistant.subject.toLowerCase().includes('história')) {
        suggestions.push('Qual foi o contexto histórico?');
      } else if (assistant.subject.toLowerCase().includes('matemática')) {
        suggestions.push('Vamos resolver um exercício?');
      } else if (assistant.subject.toLowerCase().includes('ciência')) {
        suggestions.push('Como isso funciona na prática?');
      }
    }

    // Save conversation to database for analytics
    if (!isCommand && !isActivityGeneration) {
      try {
        await supabase
          .from('student_conversations')
          .insert({
            assistant_id: assistantId,
            student_session_id: sessionId,
            message: message,
            response: aiResponse,
            sources: knowledge?.map(k => k.title) || []
          });
      } catch (dbError) {
        console.error('Error saving conversation:', dbError);
        // Don't fail the request if we can't save to DB
      }
    }

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        suggestions: suggestions.slice(0, 3) // Limit to 3 suggestions
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
