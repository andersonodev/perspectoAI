import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Brain, 
  Users, 
  Star, 
  MessageSquare,
  BookOpen,
  Calculator,
  Globe,
  Atom,
  Palette,
  Music,
  Camera,
  Code,
  TrendingUp,
  Crown
} from 'lucide-react';

interface Tutor {
  id: string;
  name: string;
  subject: string;
  icon: React.ElementType;
  rating: number;
  sessions: number;
  description: string;
  isPremium: boolean;
  color: string;
}

interface AITutorNetworkProps {
  className?: string;
}

const AITutorNetwork: React.FC<AITutorNetworkProps> = ({ className = "" }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const tutors: Tutor[] = [
    {
      id: '1',
      name: 'Prof. Mat IA',
      subject: 'Matemática',
      icon: Calculator,
      rating: 4.9,
      sessions: 1250,
      description: 'Especialista em álgebra, cálculo e geometria',
      isPremium: false,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: '2',
      name: 'Dr. Química',
      subject: 'Química',
      icon: Atom,
      rating: 4.8,
      sessions: 890,
      description: 'Química orgânica e inorgânica simplificada',
      isPremium: true,
      color: 'from-green-500 to-green-600'
    },
    {
      id: '3',
      name: 'Prof. História',
      subject: 'História',
      icon: Globe,
      rating: 4.7,
      sessions: 675,
      description: 'História mundial e do Brasil',
      isPremium: false,
      color: 'from-amber-500 to-amber-600'
    },
    {
      id: '4',
      name: 'Art IA',
      subject: 'Artes',
      icon: Palette,
      rating: 4.9,
      sessions: 420,
      description: 'História da arte e técnicas de criação',
      isPremium: true,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: '5',
      name: 'Code Master',
      subject: 'Programação',
      icon: Code,
      rating: 4.8,
      sessions: 980,
      description: 'Python, JavaScript e desenvolvimento web',
      isPremium: true,
      color: 'from-slate-500 to-slate-600'
    },
    {
      id: '6',
      name: 'Melody IA',
      subject: 'Música',
      icon: Music,
      rating: 4.6,
      sessions: 340,
      description: 'Teoria musical e composição',
      isPremium: true,
      color: 'from-pink-500 to-pink-600'
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos', icon: Brain },
    { id: 'exatas', name: 'Exatas', icon: Calculator },
    { id: 'humanas', name: 'Humanas', icon: BookOpen },
    { id: 'premium', name: 'Premium', icon: Crown }
  ];

  const filteredTutors = tutors.filter(tutor => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'premium') return tutor.isPremium;
    if (selectedCategory === 'exatas') return ['Matemática', 'Química', 'Programação'].includes(tutor.subject);
    if (selectedCategory === 'humanas') return ['História', 'Artes', 'Música'].includes(tutor.subject);
    return true;
  });

  return (
    <Card className={`feature-card ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          Rede de Tutores IA
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Category Filter */}
        <div className="mobile-nav">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`nav-pill ${selectedCategory === category.id ? 'active' : ''}`}
            >
              <category.icon className="h-4 w-4 mr-2" />
              {category.name}
            </button>
          ))}
        </div>

        {/* Tutors Grid */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {filteredTutors.map((tutor) => (
            <div
              key={tutor.id}
              className="mini-feature-card group cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className={`h-12 w-12 bg-gradient-to-br ${tutor.color}`}>
                    <AvatarFallback className="bg-transparent text-white">
                      <tutor.icon className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  {tutor.isPremium && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Crown className="h-2 w-2 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm text-foreground truncate">
                      {tutor.name}
                    </h4>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-muted-foreground">{tutor.rating}</span>
                    </div>
                  </div>
                  
                  <Badge className="bg-muted text-muted-foreground text-xs mb-2">
                    {tutor.subject}
                  </Badge>
                  
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {tutor.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      {tutor.sessions} sessões
                    </div>
                    <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                      Conversar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Upgrade */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-semibold text-foreground">Tutores Premium</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Acesse tutores especializados com IA mais avançada
          </p>
          <Button className="premium-button w-full" size="sm">
            Upgrade para Pro
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AITutorNetwork;