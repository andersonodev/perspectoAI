
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Brain, 
  ChevronDown, 
  ChevronUp,
  Info,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAITransparency } from '@/hooks/useAITransparency';
import { useI18n } from '@/hooks/useI18n';

interface TransparencyPanelProps {
  assistantId: string;
  sessionId: string;
  messageId?: string;
}

const TransparencyPanel = ({ assistantId, sessionId, messageId }: TransparencyPanelProps) => {
  const { getDecisionLogs } = useAITransparency(assistantId, sessionId);
  const { t } = useI18n();
  const [logs, setLogs] = useState<any[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expanded) {
      loadLogs();
    }
  }, [expanded, messageId]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await getDecisionLogs(messageId);
      setLogs(data);
    } catch (error) {
      console.error('Error loading transparency logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 dark:text-green-400';
    if (score >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getConfidenceIcon = (score: number) => {
    if (score >= 0.8) return <CheckCircle className="h-4 w-4" />;
    if (score >= 0.6) return <Info className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  return (
    <Card className="w-full border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm font-medium">
              {t('transparency')}
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {t('ai_reasoning')}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-6 w-6 p-0"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-1"></div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : logs.length > 0 ? (
            <div className="space-y-3">
              {logs.map((log, index) => (
                <div 
                  key={index} 
                  className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Brain className="h-3 w-3 text-purple-600" />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 capitalize">
                        {log.decision_type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className={`flex items-center space-x-1 ${getConfidenceColor(log.confidence_score || 0)}`}>
                      {getConfidenceIcon(log.confidence_score || 0)}
                      <span className="text-xs font-medium">
                        {Math.round((log.confidence_score || 0) * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    {log.reasoning}
                  </p>
                  
                  {log.input_factors && Object.keys(log.input_factors).length > 0 && (
                    <div className="text-xs text-slate-500 dark:text-slate-500">
                      <span className="font-medium">Fatores:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {Object.entries(log.input_factors).map(([key, value]: [string, any]) => (
                          <Badge key={key} variant="outline" className="text-xs">
                            {key}: {String(value)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4">
              Nenhum log de decisão disponível para esta mensagem.
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default TransparencyPanel;
