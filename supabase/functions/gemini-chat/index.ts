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
      assistantSettings = {},
      learningProfile = null,
      isCommand = false,
      isPracticeMode = false,
      isActivityGeneration = false,
      isSimulation = false,
      isLifeConnection = false 
    } = await req.json();

    console.log('Processing request:', { message, assistantId, sessionId, assistantSettings });

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

    // Get AI control settings
    const creativityLevel = assistantSettings.creativityLevel || 50;
    const citationMode = assistantSettings.citationMode || false;
    const transparencyMode = assistantSettings.transparencyMode || false;

    // Build adaptive personality prompt with new capabilities
    let personalityPrompt = `Você é ${assistant.name}, um assistente de IA especializado em ${assistant.subject}.`;
    
    // Apply creativity level settings
    if (creativityLevel <= 30) {
      personalityPrompt += `
      MODO GUARDIÃO DO CONTEÚDO:
      - Atenha-se ESTRITAMENTE ao material fornecido na base de conhecimento
      - Se a informação não estiver no material, diga claramente: "Com base no material fornecido, essa informação não está disponível"
      - Nunca invente ou extrapole informações
      - Cite sempre a fonte específica do material`;
    } else if (creativityLevel > 70) {
      personalityPrompt += `
      MODO PARCEIRO DE IDEIAS:
      - Use o material fornecido como base, mas pode criar analogias criativas
      - Conecte ideias usando conhecimento geral para enriquecer o aprendizado
      - Crie exemplos novos e metáforas que ajudem na compreensão
      - Seja criativo mas sempre mantenha a precisão acadêmica`;
    } else {
      personalityPrompt += `
      MODO EQUILIBRADO:
      - Use principalmente o material fornecido
      - Pode criar analogias simples e exemplos baseados no conteúdo
      - Mantenha um equilíbrio entre precisão e criatividade`;
    }

    // Apply personality traits
    if (assistant.personality === 'friendly') {
      personalityPrompt += ' Seja caloroso, encorajador e use linguagem acessível.';
    } else if (assistant.personality === 'formal') {
      personalityPrompt += ' Mantenha um tom profissional e direto.';
    } else if (assistant.personality === 'socratic') {
      personalityPrompt += ' Use o método socrático, fazendo perguntas que guiem o aluno ao entendimento.';
    } else if (assistant.personality === 'creative') {
      personalityPrompt += ' Use analogias criativas, metáforas e exemplos divertidos.';
    }

    // Add citation requirements
    if (citationMode) {
      personalityPrompt += `
      CITAÇÃO OBRIGATÓRIA:
      - Para cada informação específica, adicione uma citação entre parênteses
      - Formato: (Fonte: [nome do documento], página/seção [X])
      - Se usar múltiplas fontes, liste todas
      - Torne as citações discretas mas visíveis`;
    }

    // Add transparency mode
    if (transparencyMode) {
      personalityPrompt += `
      MODO TRANSPARÊNCIA:
      - Ao final de cada resposta complexa, explique brevemente seu raciocínio
      - Use uma seção "🤔 Como cheguei a esta resposta:" 
      - Seja claro sobre quais fontes usou e como conectou as informações`;
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

    // Enhanced modes for advanced features
    if (isSimulation) {
      personalityPrompt += `
        MODO SIMULAÇÃO ATIVADO: Você está auxiliando em uma simulação interativa.
        - Explique os conceitos por trás da simulação
        - Conecte os parâmetros com a teoria
        - Sugira experimentos com diferentes valores
        - Use linguagem visual e descritiva
        - Incentive a exploração e experimentação`;
    }

    if (isLifeConnection) {
      personalityPrompt += `
        MODO CONEXÃO COM A VIDA REAL: Foque em aplicações práticas e relevantes.
        - Mostre como o conceito se aplica no dia a dia
        - Dê exemplos de profissões que usam isso
        - Conecte com tecnologias atuais
        - Explique oportunidades de carreira
        - Use exemplos concretos e familiares ao aluno
        - Torne o abstrato em concreto`;
    }

    // Smart topic extraction for spaced repetition
    if (!isCommand && !isActivityGeneration && !isSimulation) {
      personalityPrompt += `
        EXTRAÇÃO INTELIGENTE DE TÓPICOS:
        Ao final de explicações substantivas, identifique tópicos chave que merecem revisão.
        Formate assim: [TÓPICO_REVISÃO: Nome do Conceito Principal]
        Faça isso apenas para conceitos importantes que o aluno deve revisar depois.`;
    }

    // Enhanced study planning assistance
    if (message.includes('plano') || message.includes('estudar') || message.includes('prova')) {
      personalityPrompt += `
        ASSISTENTE DE PLANEJAMENTO:
        - Sugira métodos de estudo eficazes
        - Recomende distribuição temporal
        - Identifique prioridades de estudo
        - Ofereça estratégias de revisão
        - Considere a Curva de Esquecimento de Ebbinghaus`;
    }

    // Knowledge gap detection and recommendation
    personalityPrompt += `
      DETECÇÃO DE LACUNAS:
      Se perceber que o aluno tem dificuldades com pré-requisitos, sugira revisar conceitos básicos primeiro.
      Use frases como: "Antes de continuarmos, seria útil revisar [conceito básico]"`;

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
          temperature: creativityLevel > 50 ? 0.8 : 0.4, // Adjust temperature based on creativity level
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

    let aiResponse = data.candidates[0].content.parts[0].text;

    // Extract topic for spaced repetition
    let extractedTopic = '';
    const topicMatch = aiResponse.match(/\[TÓPICO_REVISÃO:\s*(.+?)\]/);
    if (topicMatch) {
      extractedTopic = topicMatch[1].trim();
      aiResponse = aiResponse.replace(/\[TÓPICO_REVISÃO:\s*.+?\]/g, '').trim();
    }

    // Extract citations if citation mode is enabled
    let citations: string[] = [];
    let reasoning = '';

    if (citationMode) {
      const citationRegex = /\(Fonte: ([^)]+)\)/g;
      let match;
      while ((match = citationRegex.exec(aiResponse)) !== null) {
        citations.push(match[1]);
      }
    }

    // Extract reasoning if transparency mode is enabled
    if (transparencyMode) {
      const reasoningMatch = aiResponse.match(/🤔 Como cheguei a esta resposta:\s*(.+?)(?=\n\n|\n$|$)/s);
      if (reasoningMatch) {
        reasoning = reasoningMatch[1].trim();
      }
    }

    // Generate context-aware suggestions
    let suggestions: string[] = [];
    
    if (!isCommand && !isActivityGeneration) {
      // Basic suggestions
      suggestions = [
        'Pode dar um exemplo prático?',
        'Como isso se aplica no dia a dia?',
        'Tem algum exercício sobre isso?'
      ];

      // Advanced command suggestions
      if (aiResponse.includes('conceito') || aiResponse.includes('teoria')) {
        suggestions.push('/conectar - Ver aplicações reais');
      }
      
      if (aiResponse.includes('fórmula') || aiResponse.includes('cálculo') || aiResponse.includes('equação')) {
        suggestions.push('/simular - Simulação interativa');
      }

      if (aiResponse.includes('estudo') || aiResponse.includes('prova') || aiResponse.includes('exame')) {
        suggestions.push('/criar_plano - Plano de estudos inteligente');
      }

      // Subject-specific suggestions
      if (assistant.subject.toLowerCase().includes('história')) {
        suggestions.push('Qual foi o contexto histórico?');
      } else if (assistant.subject.toLowerCase().includes('matemática')) {
        suggestions.push('Vamos resolver um problema juntos?');
      } else if (assistant.subject.toLowerCase().includes('ciência')) {
        suggestions.push('Como funciona na prática?');
      }

      // Knowledge map suggestion
      if (extractedTopic) {
        suggestions.push('/mapa - Ver no mapa de conhecimento');
      }
    }

    // Save enhanced conversation data
    if (!isCommand && !isActivityGeneration) {
      try {
        const conversationData = {
          assistant_id: assistantId,
          student_session_id: sessionId,
          message: message,
          response: aiResponse,
          sources: knowledge?.map(k => k.title) || [],
          extracted_topic: extractedTopic,
          response_type: isSimulation ? 'simulation' : isLifeConnection ? 'life_connection' : 'regular'
        };

        await supabase
          .from('student_conversations')
          .insert(conversationData);

        // Add to spaced repetition if topic was extracted
        if (extractedTopic) {
          const nextReview = new Date();
          nextReview.setDate(nextReview.getDate() + 2); // Review in 2 days

          await supabase
            .from('spaced_repetition_items')
            .insert({
              assistant_id: assistantId,
              session_id: sessionId,
              topic: extractedTopic,
              last_reviewed: new Date().toISOString(),
              next_review: nextReview.toISOString(),
              difficulty: 'medium',
              streak: 0
            });
        }

      } catch (dbError) {
        console.error('Error saving enhanced conversation:', dbError);
      }
    }

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        suggestions: suggestions.slice(0, 4), // Limit to 4 suggestions
        citations: citations,
        reasoning: reasoning,
        extractedTopic: extractedTopic
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
