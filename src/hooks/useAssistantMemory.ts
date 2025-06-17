
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MemoryEntry {
  id: string;
  assistant_id: string;
  user_id: string | null;
  session_id: string | null;
  memory_type: string;
  key: string;
  value: any;
  confidence_score: number;
  last_updated: string;
  created_at: string;
}

export const useAssistantMemory = (assistantId: string, sessionId: string) => {
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const saveMemory = useCallback(async (
    type: string,
    key: string,
    value: any,
    confidenceScore: number = 0.8
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Check if memory already exists
      const { data: existing } = await supabase
        .from('assistant_memory')
        .select('*')
        .eq('assistant_id', assistantId)
        .eq('user_id', user?.id || null)
        .eq('session_id', sessionId)
        .eq('memory_type', type)
        .eq('key', key)
        .single();

      if (existing) {
        // Update existing memory
        const { error } = await supabase
          .from('assistant_memory')
          .update({
            value,
            confidence_score: confidenceScore,
            last_updated: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Create new memory
        const { error } = await supabase
          .from('assistant_memory')
          .insert({
            assistant_id: assistantId,
            user_id: user?.id || null,
            session_id: sessionId,
            memory_type: type,
            key,
            value,
            confidence_score: confidenceScore
          });

        if (error) throw error;
      }

      await loadMemories();
    } catch (error) {
      console.error('Error saving memory:', error);
    }
  }, [assistantId, sessionId]);

  const loadMemories = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('assistant_memory')
        .select('*')
        .eq('assistant_id', assistantId)
        .eq('user_id', user?.id || null)
        .eq('session_id', sessionId)
        .order('last_updated', { ascending: false });

      if (error) throw error;
      setMemories(data || []);
    } catch (error) {
      console.error('Error loading memories:', error);
    } finally {
      setLoading(false);
    }
  }, [assistantId, sessionId]);

  const getMemory = useCallback((type: string, key: string) => {
    return memories.find(m => m.memory_type === type && m.key === key);
  }, [memories]);

  const analyzeUserPreferences = useCallback(async (messages: any[]) => {
    // Analyze user messages to extract preferences
    const recentMessages = messages.slice(-10).filter(m => m.role === 'user');
    
    // Detect learning style preferences
    const visualKeywords = ['imagem', 'visual', 'gráfico', 'diagrama', 'esquema'];
    const audioKeywords = ['áudio', 'explicar', 'falar', 'ouvir'];
    const textKeywords = ['ler', 'texto', 'escrever', 'resumir'];
    
    const messageText = recentMessages.map(m => m.content.toLowerCase()).join(' ');
    
    let learningStyle = 'mixed';
    if (visualKeywords.some(word => messageText.includes(word))) {
      learningStyle = 'visual';
    } else if (audioKeywords.some(word => messageText.includes(word))) {
      learningStyle = 'auditory';
    } else if (textKeywords.some(word => messageText.includes(word))) {
      learningStyle = 'reading';
    }

    await saveMemory('learning_style', 'preferred_style', learningStyle, 0.7);

    // Detect complexity preference
    const complexWords = ['detalhado', 'aprofundar', 'complexo', 'avançado'];
    const simpleWords = ['simples', 'básico', 'resumir', 'direto'];
    
    let complexityLevel = 'medium';
    if (complexWords.some(word => messageText.includes(word))) {
      complexityLevel = 'high';
    } else if (simpleWords.some(word => messageText.includes(word))) {
      complexityLevel = 'low';
    }

    await saveMemory('complexity', 'preferred_level', complexityLevel, 0.6);

  }, [saveMemory]);

  return {
    memories,
    loading,
    saveMemory,
    loadMemories,
    getMemory,
    analyzeUserPreferences
  };
};
