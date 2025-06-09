
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, assistantId, sessionId } = await req.json();
    
    if (!message || !assistantId) {
      throw new Error('Message and assistantId are required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get assistant data
    const { data: assistant, error: assistantError } = await supabase
      .from('ai_assistants')
      .select('*')
      .eq('id', assistantId)
      .single();

    if (assistantError || !assistant) {
      throw new Error('Assistant not found');
    }

    // Get assistant knowledge
    const { data: knowledge, error: knowledgeError } = await supabase
      .from('assistant_knowledge')
      .select('*')
      .eq('assistant_id', assistantId);

    if (knowledgeError) {
      console.error('Error fetching knowledge:', knowledgeError);
    }

    // Build context from knowledge base
    let context = `Você é ${assistant.name}, um assistente de ${assistant.subject}.`;
    
    if (assistant.welcome_message) {
      context += ` ${assistant.welcome_message}`;
    }

    context += ` Sua personalidade é ${assistant.personality}.`;

    if (knowledge && knowledge.length > 0) {
      context += "\n\nConhecimento disponível:\n";
      knowledge.forEach((item, index) => {
        context += `\n${index + 1}. ${item.title}:\n${item.content}\n`;
      });
      context += "\nUse apenas as informações fornecidas acima para responder. Se a pergunta não puder ser respondida com o conteúdo disponível, diga que você não tem essa informação específica.";
    }

    // Call Gemini API
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${context}\n\nPergunta do estudante: ${message}`
                }
              ]
            }
          ]
        })
      }
    );

    if (!geminiResponse.ok) {
      const error = await geminiResponse.text();
      console.error('Gemini API error:', error);
      throw new Error('Failed to get response from Gemini');
    }

    const geminiData = await geminiResponse.json();
    const response = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'Desculpe, não consegui gerar uma resposta.';

    // Save conversation
    const { error: saveError } = await supabase
      .from('student_conversations')
      .insert({
        assistant_id: assistantId,
        student_session_id: sessionId || 'anonymous',
        message,
        response,
        sources: knowledge?.map(k => k.title) || []
      });

    if (saveError) {
      console.error('Error saving conversation:', saveError);
    }

    return new Response(
      JSON.stringify({ response }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
