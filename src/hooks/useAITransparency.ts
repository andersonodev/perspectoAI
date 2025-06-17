
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DecisionLog {
  decision_type: string;
  reasoning: string;
  confidence_score: number;
  input_factors: any;
}

export const useAITransparency = (assistantId: string, sessionId: string) => {
  
  const logDecision = useCallback(async (
    messageId: string,
    decisionType: string,
    reasoning: string,
    confidenceScore: number,
    inputFactors: any = {}
  ) => {
    try {
      const { error } = await supabase
        .from('ai_decision_logs')
        .insert({
          assistant_id: assistantId,
          session_id: sessionId,
          message_id: messageId,
          decision_type: decisionType,
          reasoning,
          confidence_score: confidenceScore,
          input_factors: inputFactors
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging AI decision:', error);
    }
  }, [assistantId, sessionId]);

  const getDecisionLogs = useCallback(async (messageId?: string) => {
    try {
      let query = supabase
        .from('ai_decision_logs')
        .select('*')
        .eq('assistant_id', assistantId)
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

      if (messageId) {
        query = query.eq('message_id', messageId);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error getting decision logs:', error);
      return [];
    }
  }, [assistantId, sessionId]);

  return {
    logDecision,
    getDecisionLogs
  };
};
