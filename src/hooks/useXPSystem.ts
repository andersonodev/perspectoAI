
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  total_xp: number;
  level: number;
  badges: any[];
  preferences: any;
  created_at: string;
  updated_at: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned_at: string;
}

export const useXPSystem = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            display_name: user.email?.split('@')[0] || 'Estudante',
            total_xp: 0,
            level: 1,
            badges: [],
            preferences: { theme: 'light', language: 'pt' }
          })
          .select()
          .single();

        if (createError) throw createError;
        profile = newProfile;
      } else if (error) {
        throw error;
      }

      setProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const awardXP = async (amount: number, activityType: string, metadata: any = {}) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !profile) return;

      // Record activity
      await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          xp_earned: amount,
          metadata
        });

      const newXP = profile.total_xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      const leveledUp = newLevel > profile.level;

      // Update profile
      const { data: updatedProfile, error } = await supabase
        .from('user_profiles')
        .update({
          total_xp: newXP,
          level: newLevel,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(updatedProfile);

      // Check for new badges
      await checkForNewBadges(newXP, newLevel, activityType);

      // Show XP notification
      toast({
        title: `+${amount} XP`,
        description: leveledUp ? `🎉 Subiu para o nível ${newLevel}!` : `Atividade: ${activityType}`,
        variant: "default"
      });

    } catch (error) {
      console.error('Error awarding XP:', error);
    }
  };

  const checkForNewBadges = async (xp: number, level: number, activityType: string) => {
    const availableBadges = [
      { id: 'first_message', name: 'Primeira Conversa', description: 'Enviou sua primeira mensagem', icon: '💬', condition: (xp: number, level: number, type: string) => type === 'message_sent' && xp >= 10 },
      { id: 'level_5', name: 'Estudante Dedicado', description: 'Alcançou o nível 5', icon: '📚', condition: (xp: number, level: number) => level >= 5 },
      { id: 'flashcard_master', name: 'Mestre dos Flashcards', description: 'Criou 10 flashcards', icon: '🃏', condition: (xp: number, level: number, type: string) => type === 'flashcard_created' },
      { id: 'week_streak', name: 'Semana Consistente', description: 'Estudou 7 dias seguidos', icon: '🔥', condition: (xp: number, level: number) => xp >= 700 }
    ];

    const currentBadgeIds = profile?.badges.map((b: any) => b.id) || [];
    
    for (const badge of availableBadges) {
      if (!currentBadgeIds.includes(badge.id) && badge.condition(xp, level, activityType)) {
        await awardBadge(badge);
      }
    }
  };

  const awardBadge = async (badge: any) => {
    if (!profile) return;

    const newBadge = {
      ...badge,
      earned_at: new Date().toISOString()
    };

    const updatedBadges = [...profile.badges, newBadge];

    const { error } = await supabase
      .from('user_profiles')
      .update({
        badges: updatedBadges,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', profile.user_id);

    if (error) {
      console.error('Error awarding badge:', error);
      return;
    }

    setProfile(prev => prev ? { ...prev, badges: updatedBadges } : null);

    toast({
      title: "🏆 Nova Conquista!",
      description: `${badge.icon} ${badge.name}: ${badge.description}`,
      variant: "default"
    });
  };

  return {
    profile,
    loading,
    awardXP,
    loadUserProfile
  };
};
