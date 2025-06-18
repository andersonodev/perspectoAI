
import { useState, useCallback } from 'react';

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
      // For now, just log to console and save to localStorage until the table is created
      const memoryData = {
        assistantId,
        sessionId,
        type,
        key,
        value,
        confidenceScore,
        timestamp: new Date().toISOString()
      };
      
      console.log('Saving memory:', memoryData);
      
      // Save to localStorage as fallback
      const storageKey = `memory_${assistantId}_${sessionId}_${type}_${key}`;
      localStorage.setItem(storageKey, JSON.stringify(memoryData));
      
      return memoryData;
    } catch (error) {
      console.error('Error saving memory:', error);
    }
  }, [assistantId, sessionId]);

  const loadMemories = useCallback(async () => {
    setLoading(true);
    try {
      // For now, return empty array until the table is created
      setMemories([]);
    } catch (error) {
      console.error('Error loading memories:', error);
    } finally {
      setLoading(false);
    }
  }, [assistantId, sessionId]);

  const getMemory = useCallback((type: string, key: string) => {
    // Try to get from localStorage as fallback
    const storageKey = `memory_${assistantId}_${sessionId}_${type}_${key}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing stored memory:', error);
      }
    }
    return null;
  }, [assistantId, sessionId]);

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
