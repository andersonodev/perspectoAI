
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AssistantKnowledge, AddKnowledgeRequest } from '@/types/database';
import { toast } from '@/hooks/use-toast';

export const useKnowledge = (assistantId: string) => {
  const [knowledge, setKnowledge] = useState<AssistantKnowledge[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKnowledge = async () => {
    if (!assistantId) return;
    
    try {
      const { data, error } = await supabase
        .from('assistant_knowledge')
        .select('*')
        .eq('assistant_id', assistantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setKnowledge(data || []);
    } catch (error) {
      console.error('Error fetching knowledge:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o conhecimento do assistente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addKnowledge = async (knowledgeData: Omit<AddKnowledgeRequest, 'assistant_id'>) => {
    try {
      const { data, error } = await supabase
        .from('assistant_knowledge')
        .insert([{
          assistant_id: assistantId,
          ...knowledgeData
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Conhecimento adicionado com sucesso!"
      });

      await fetchKnowledge();
      return data;
    } catch (error) {
      console.error('Error adding knowledge:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o conhecimento.",
        variant: "destructive"
      });
      return null;
    }
  };

  const uploadPDF = async (file: File) => {
    try {
      setLoading(true);
      
      // Convert file to base64
      const reader = new FileReader();
      const fileContent = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Call the PDF processing function
      const { data, error } = await supabase.functions.invoke('process-pdf', {
        body: {
          fileContent,
          fileName: file.name,
          assistantId
        }
      });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "PDF processado e adicionado ao assistente!"
      });

      await fetchKnowledge();
      return data;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar o PDF.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteKnowledge = async (id: string) => {
    try {
      const { error } = await supabase
        .from('assistant_knowledge')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Conhecimento removido com sucesso!"
      });

      await fetchKnowledge();
    } catch (error) {
      console.error('Error deleting knowledge:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o conhecimento.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, [assistantId]);

  return {
    knowledge,
    loading,
    addKnowledge,
    uploadPDF,
    deleteKnowledge,
    refetch: fetchKnowledge
  };
};
