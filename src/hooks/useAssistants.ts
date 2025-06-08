
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AIAssistant, CreateAssistantRequest } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useAssistants = () => {
  const [assistants, setAssistants] = useState<AIAssistant[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAssistants = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('ai_assistants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssistants(data || []);
    } catch (error) {
      console.error('Error fetching assistants:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os assistentes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createAssistant = async (assistantData: CreateAssistantRequest) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('ai_assistants')
        .insert([{
          user_id: user.id,
          ...assistantData
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Assistente criado com sucesso!"
      });

      await fetchAssistants();
      return data;
    } catch (error) {
      console.error('Error creating assistant:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o assistente.",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateAssistant = async (id: string, updates: Partial<AIAssistant>) => {
    try {
      const { error } = await supabase
        .from('ai_assistants')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Assistente atualizado com sucesso!"
      });

      await fetchAssistants();
    } catch (error) {
      console.error('Error updating assistant:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o assistente.",
        variant: "destructive"
      });
    }
  };

  const deleteAssistant = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ai_assistants')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Assistente excluído com sucesso!"
      });

      await fetchAssistants();
    } catch (error) {
      console.error('Error deleting assistant:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o assistente.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchAssistants();
  }, [user]);

  return {
    assistants,
    loading,
    createAssistant,
    updateAssistant,
    deleteAssistant,
    refetch: fetchAssistants
  };
};
