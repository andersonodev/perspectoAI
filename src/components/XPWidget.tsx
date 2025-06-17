
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Zap } from 'lucide-react';
import { useXPSystem } from '@/hooks/useXPSystem';
import { useI18n } from '@/hooks/useI18n';

const XPWidget = () => {
  const { profile, loading } = useXPSystem();
  const { t } = useI18n();

  if (loading || !profile) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-slate-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const xpForCurrentLevel = (profile.level - 1) * 100;
  const xpForNextLevel = profile.level * 100;
  const currentLevelProgress = profile.total_xp - xpForCurrentLevel;
  const xpNeededForNext = xpForNextLevel - profile.total_xp;
  const progressPercentage = (currentLevelProgress / 100) * 100;

  return (
    <Card className="w-full bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Star className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {t('level')} {profile.level}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {profile.total_xp.toLocaleString()} {t('xp')}
              </p>
            </div>
          </div>
          
          {profile.badges.length > 0 && (
            <div className="flex items-center space-x-1">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {profile.badges.length}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>{currentLevelProgress}/100 XP</span>
            <span>{xpNeededForNext} para próximo nível</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {profile.badges.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
              {t('badges')}
            </p>
            <div className="flex flex-wrap gap-1">
              {profile.badges.slice(0, 3).map((badge: any, index: number) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400"
                  title={badge.description}
                >
                  {badge.icon} {badge.name}
                </Badge>
              ))}
              {profile.badges.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{profile.badges.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default XPWidget;
