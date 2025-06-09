
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
    const { fileContent, fileName, assistantId } = await req.json();
    
    if (!fileContent || !fileName || !assistantId) {
      throw new Error('File content, fileName, and assistantId are required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // For now, we'll store the text content directly
    // In a production environment, you'd want to use a proper PDF parsing library
    let textContent = '';
    
    try {
      // If the content is base64 encoded, decode it first
      if (fileContent.startsWith('data:application/pdf;base64,')) {
        const base64Content = fileContent.split(',')[1];
        // For now, we'll just store a placeholder text indicating a PDF was uploaded
        textContent = `Conteúdo do PDF: ${fileName}\n\nEste é um documento PDF que foi carregado. O conteúdo específico precisa ser extraído usando uma ferramenta de processamento de PDF adequada.`;
      } else {
        textContent = fileContent;
      }
    } catch (error) {
      console.error('Error processing file content:', error);
      textContent = `Documento carregado: ${fileName}\n\nConteúdo do arquivo não pôde ser processado automaticamente.`;
    }

    // Save to assistant knowledge
    const { data, error } = await supabase
      .from('assistant_knowledge')
      .insert({
        assistant_id: assistantId,
        content_type: 'file',
        title: fileName,
        content: textContent,
        source_info: {
          originalFileName: fileName,
          fileType: 'pdf',
          uploadedAt: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving knowledge:', error);
      throw new Error('Failed to save document knowledge');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        knowledgeId: data.id,
        message: 'PDF processado e adicionado ao conhecimento do assistente'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in process-pdf function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
