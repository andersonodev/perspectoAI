
import { useState, useEffect } from 'react';
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
      // For now, create a mock profile until the table is created
      const mockProfile: UserProfile = {
        id: 'mock-id',
        user_id: 'mock-user-id',
        display_name: 'Estudante',
        total_xp: 100,
        level: 2,
        badges: [
          {
            id: 'first_message',
            name: 'Primeira Conversa',
            description: 'Enviou sua primeira mensagem',
            icon: '💬',
            earned_at: new Date().toISOString()
          }
        ],
        preferences: { theme: 'light', language: 'pt' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Try to load from localStorage
      const stored = localStorage.getItem('user_profile');
      if (stored) {
        try {
          const parsedProfile = JSON.parse(stored);
          setProfile({ ...mockProfile, ...parsedProfile });
        } catch (error) {
          setProfile(mockProfile);
        }
      } else {
        setProfile(mockProfile);
        localStorage.setItem('user_profile', JSON.stringify(mockProfile));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const awardXP = async (amount: number, activityType: string, metadata: any = {}) => {
    try {
      if (!profile) return;

      console.log('Awarding XP:', { amount, activityType, metadata });

      const newXP = profile.total_xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      const leveledUp = newLevel > profile.level;

      // Update profile
      const updatedProfile = {
        ...profile,
        total_xp: newXP,
        level: newLevel,
        updated_at: new Date().toISOString()
      };

      setProfile(updatedProfile);
      
      // Save to localStorage
      localStorage.setItem('user_profile', JSON.stringify(updatedProfile));

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
    const updatedProfile = {
      ...profile,
      badges: updatedBadges,
      updated_at: new Date().toISOString()
    };

    setProfile(updatedProfile);
    localStorage.setItem('user_profile', JSON.stringify(updatedProfile));

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
