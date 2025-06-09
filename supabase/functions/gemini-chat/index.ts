
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, assistantId, sessionId, conversationHistory, isCommand } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
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
    let knowledgeContext = '';
    if (knowledge && knowledge.length > 0) {
      knowledgeContext = knowledge.map(k => `${k.title}: ${k.content}`).join('\n\n');
    }

    // Build personality prompt
    const personalityPrompts = {
      friendly: "Seja amigável, caloroso e acessível. Use um tom conversacional e encorajador.",
      formal: "Seja profissional, direto e objetivo. Use linguagem formal e estruturada.",
      socratic: "Ensine através de perguntas reflexivas. Guie o aluno a descobrir respostas por si mesmo.",
      creative: "Use analogias criativas, metáforas e exemplos divertidos. Seja entusiástico e imaginativo."
    };

    // Build system prompt
    const systemPrompt = `Você é ${assistant.name}, um assistente de IA especializado em ${assistant.subject}.

Personalidade: ${personalityPrompts[assistant.personality as keyof typeof personalityPrompts]}

${assistant.guardrails?.instructions ? `Instruções especiais: ${assistant.guardrails.instructions}` : ''}

Base de conhecimento:
${knowledgeContext}

Diretrizes importantes:
- Sempre responda em português brasileiro
- Mantenha o foco na matéria: ${assistant.subject}
- ${assistant.personality === 'socratic' ? 'Sempre responda com perguntas que levem à reflexão' : 'Forneça respostas claras e educativas'}
- Se não souber algo, seja honesto e diga "Não tenho informações sobre isso em minha base de conhecimento"
- ${isCommand ? 'Este é um comando especial, execute conforme solicitado' : 'Ao final de respostas importantes, sugira 2-3 perguntas de aprofundamento'}
- Use formatação markdown quando apropriado (negrito, listas, etc.)

Responda sempre como ${assistant.name} e mantenha o tom ${assistant.personality}.`;

    // Prepare messages for Gemini
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history if available
    if (conversationHistory && conversationHistory.length > 0) {
      // Take last 10 messages to avoid context limit
      const recentHistory = conversationHistory.slice(-10);
      messages.push(...recentHistory.map((msg: any) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      })));
    }

    // Add current message
    messages.push({ role: 'user', content: message });

    // Call Gemini API
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not found');
    }

    // Prepare content for Gemini
    const contents = messages.filter(m => m.role !== 'system').map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Add system prompt as the first user message
    contents.unshift({
      role: 'user',
      parts: [{ text: systemPrompt }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Desculpe, não consegui processar sua mensagem.';

    // Generate suggestions for non-command responses
    let suggestions: string[] = [];
    if (!isCommand && assistant.personality !== 'socratic') {
      suggestions = [
        'Pode explicar isso de forma mais simples?',
        'Tem algum exemplo prático?',
        'Como isso se aplica no dia a dia?'
      ];
    }

    // Check for knowledge gaps
    if (aiResponse.toLowerCase().includes('não sei') || 
        aiResponse.toLowerCase().includes('não tenho informação') ||
        aiResponse.toLowerCase().includes('não posso responder')) {
      
      // Track knowledge gap
      try {
        const { data: existingGap } = await supabase
          .from('knowledge_gaps')
          .select('*')
          .eq('assistant_id', assistantId)
          .eq('question', message)
          .single();

        if (existingGap) {
          await supabase
            .from('knowledge_gaps')
            .update({
              frequency: existingGap.frequency + 1,
              last_asked: new Date().toISOString()
            })
            .eq('id', existingGap.id);
        } else {
          await supabase
            .from('knowledge_gaps')
            .insert({
              assistant_id: assistantId,
              question: message,
              frequency: 1
            });
        }
      } catch (error) {
        console.error('Error tracking knowledge gap:', error);
      }
    }

    // Save conversation to database
    try {
      await supabase
        .from('student_conversations')
        .insert({
          assistant_id: assistantId,
          student_session_id: sessionId,
          message,
          response: aiResponse,
          sources: knowledge?.map(k => k.title) || []
        });
    } catch (error) {
      console.error('Error saving conversation:', error);
    }

    // Update or create session
    try {
      const { data: existingSession } = await supabase
        .from('conversation_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .eq('assistant_id', assistantId)
        .single();

      const currentMessages = existingSession?.messages || [];
      const updatedMessages = [
        ...currentMessages,
        { role: 'user', content: message, timestamp: new Date().toISOString() },
        { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() }
      ];

      if (existingSession) {
        await supabase
          .from('conversation_sessions')
          .update({
            messages: updatedMessages,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSession.id);
      } else {
        await supabase
          .from('conversation_sessions')
          .insert({
            session_id: sessionId,
            assistant_id: assistantId,
            messages: updatedMessages
          });
      }
    } catch (error) {
      console.error('Error updating session:', error);
    }

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        suggestions 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
})
