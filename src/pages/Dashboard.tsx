import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Plus, 
  Bot, 
  Users, 
  BarChart3, 
  Settings, 
  Share2, 
  Eye,
  EyeOff,
  Trash2,
  Edit,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Calendar,
  Zap,
  Crown,
  Star,
  Gem,
  Palette,
  Menu,
  X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAssistants } from '@/hooks/useAssistants';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { assistants, loading, refetch } = useAssistants();
  const [updatingAssistant, setUpdatingAssistant] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleTogglePublish = async (assistantId: string, currentlyPublished: boolean) => {
    setUpdatingAssistant(assistantId);
    try {
      const { error } = await supabase
        .from('ai_assistants')
        .update({ is_published: !currentlyPublished })
        .eq('id', assistantId);

      if (error) throw error;

      toast({
        title: currentlyPublished ? "Assistente despublicado" : "Assistente publicado",
        description: currentlyPublished 
          ? "Seu assistente não está mais visível para estudantes." 
          : "Seu assistente está agora disponível para estudantes!",
      });

      refetch();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status de publicação.",
        variant: "destructive"
      });
    } finally {
      setUpdatingAssistant(null);
    }
  };

  const handleDeleteAssistant = async (assistantId: string, assistantName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o assistente "${assistantName}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('ai_assistants')
        .delete()
        .eq('id', assistantId);

      if (error) throw error;

      toast({
        title: "Assistente excluído",
        description: `O assistente "${assistantName}" foi excluído com sucesso.`,
      });

      refetch();
    } catch (error) {
      console.error('Error deleting assistant:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o assistente.",
        variant: "destructive"
      });
    }
  };

  const copyShareLink = (assistantId: string, assistantName: string) => {
    const shareUrl = `${window.location.origin}/chat/${assistantId}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copiado!",
      description: `Link de compartilhamento do assistente "${assistantName}" copiado para a área de transferência.`,
    });
  };

  const getPersonalityIcon = (personality: string) => {
    switch (personality) {
      case 'friendly': return '😊';
      case 'formal': return '🎓';
      case 'socratic': return '🤔';
      case 'creative': return '🎨';
      default: return '🤖';
    }
  };

  const getPersonalityLabel = (personality: string) => {
    switch (personality) {
      case 'friendly': return 'Amigável';
      case 'formal': return 'Formal';
      case 'socratic': return 'Socrático';
      case 'creative': return 'Criativo';
      default: return 'Padrão';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground font-medium">Carregando seu workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen modern-gradient-bg relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 bg-card/80 backdrop-blur-xl border-b border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img 
                    src="/lovable-uploads/88cf8fc6-b9d1-4447-b0c5-ba3ec309066d.png" 
                    alt="Mentor AI" 
                    className="h-10 w-auto drop-shadow-lg"
                  />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full animate-pulse"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Workspace Educador
                  </h1>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-foreground hover:text-foreground hover:bg-accent"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {/* Desktop User Menu */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/30 shadow-lg bg-gradient-to-br from-primary to-secondary">
                    <AvatarFallback className="text-white font-semibold bg-gradient-to-br from-primary to-secondary">
                      {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-secondary to-yellow-400 rounded-full flex items-center justify-center">
                    <Crown className="h-2 w-2 text-yellow-900" />
                  </div>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-foreground">{user?.email}</p>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Gem className="h-3 w-3" />
                    Educador Pro
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                onClick={handleSignOut} 
                className="text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-300"
              >
                Sair
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-border py-4 bg-card/80 backdrop-blur-xl">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-8 w-8 ring-2 ring-primary/30 bg-gradient-to-br from-primary to-secondary">
                  <AvatarFallback className="text-white text-sm bg-gradient-to-br from-primary to-secondary">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium text-foreground">{user?.email}</p>
                  <p className="text-muted-foreground text-xs flex items-center gap-1">
                    <Gem className="h-2 w-2" />
                    Educador Pro
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                onClick={handleSignOut}
                className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                Sair
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-2">
                Bem-vindo ao seu Workspace Educador ✨
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Crie experiências de aprendizado extraordinárias com tecnologia de ponta em IA educacional.
              </p>
            </div>
            <Link to="/create-assistant" className="lg:flex-shrink-0">
              <Button className="w-full lg:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 border-0 px-8 py-3">
                <Plus className="h-5 w-5 mr-2" />
                Criar Assistente
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {[
            { 
              title: "Assistentes", 
              value: assistants?.length || 0, 
              icon: Bot, 
              gradient: "from-primary to-primary/80",
              iconBg: "bg-primary/20",
              textColor: "text-foreground"
            },
            { 
              title: "Publicados", 
              value: assistants?.filter(a => a.is_published).length || 0, 
              icon: Eye, 
              gradient: "from-secondary to-secondary/80",
              iconBg: "bg-secondary/20",
              textColor: "text-foreground"
            },
            { 
              title: "Interações", 
              value: "127", 
              icon: MessageSquare, 
              gradient: "from-primary to-secondary",
              iconBg: "bg-accent/20",
              textColor: "text-foreground"
            },
            { 
              title: "Satisfação", 
              value: "94%", 
              icon: Star, 
              gradient: "from-secondary to-secondary/60",
              iconBg: "bg-secondary/20",
              textColor: "text-foreground"
            }
          ].map((stat, index) => (
            <Card key={index} className="border-0 bg-card/80 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-border/50">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs lg:text-sm ${stat.textColor} opacity-70 mb-1`}>{stat.title}</p>
                    <p className="text-xl lg:text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`${stat.iconBg} p-2 lg:p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-5 w-5 lg:h-6 lg:w-6 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Assistants Section */}
          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-foreground flex items-center gap-2">
                <Palette className="h-6 w-6 text-primary" />
                Meus Assistentes
              </h2>
            </div>

            {assistants && assistants.length > 0 ? (
              <div className="space-y-4">
                {assistants.map((assistant, index) => (
                  <Card key={assistant.id} className="border-0 bg-card/80 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-border/50">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex items-start space-x-4 flex-1 min-w-0">
                          <div className="relative flex-shrink-0">
                            <Avatar className="h-12 w-12 lg:h-14 lg:w-14 ring-2 ring-primary/30 bg-gradient-to-br from-primary to-secondary">
                              <AvatarFallback className="text-white font-semibold text-lg bg-gradient-to-br from-primary to-secondary">
                                {getPersonalityIcon(assistant.personality)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-secondary to-yellow-400 rounded-full flex items-center justify-center">
                              <Sparkles className="h-2 w-2 text-white" />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-foreground truncate">
                                {assistant.name}
                              </h3>
                              <Badge 
                                variant={assistant.is_published ? "default" : "secondary"}
                                className={assistant.is_published 
                                  ? "bg-gradient-to-r from-success to-success/80 text-white border-0 shadow-lg" 
                                  : "bg-muted text-muted-foreground border-border"
                                }
                              >
                                {assistant.is_published ? (
                                  <>
                                    <Eye className="h-3 w-3 mr-1" />
                                    Publicado
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="h-3 w-3 mr-1" />
                                    Rascunho
                                  </>
                                )}
                              </Badge>
                            </div>
                            
                            <p className="text-muted-foreground mb-3 text-sm lg:text-base">{assistant.subject}</p>
                            
                            <div className="flex flex-wrap gap-2">
                              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                                {getPersonalityLabel(assistant.personality)}
                              </Badge>
                              
                              {assistant.guardrails?.citationMode && (
                                <Badge className="bg-secondary/20 text-secondary border-secondary/30 text-xs">
                                  📚 Cita Fontes
                                </Badge>
                              )}
                              
                              {assistant.guardrails?.antiCheatMode && (
                                <Badge className="bg-warning/20 text-warning border-warning/30 text-xs">
                                  🛡️ Anti-Cola
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end lg:justify-start space-x-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTogglePublish(assistant.id, assistant.is_published)}
                            disabled={updatingAssistant === assistant.id}
                            className="text-muted-foreground hover:text-foreground hover:bg-accent p-2"
                          >
                            {assistant.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          
                          {assistant.is_published && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyShareLink(assistant.id, assistant.name)}
                              className="text-muted-foreground hover:text-foreground hover:bg-accent p-2"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Link to={`/assistant/${assistant.id}/analytics`}>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent p-2">
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                          </Link>
                          
                          <Link to={`/assistant/${assistant.id}/edit`}>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent p-2">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAssistant(assistant.id, assistant.name)}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-0 bg-card/80 backdrop-blur-xl shadow-lg border border-border/50">
                <CardContent className="text-center py-12 lg:py-16">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bot className="h-10 w-10 lg:h-12 lg:w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Seu primeiro assistente
                  </h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm lg:text-base">
                    Crie seu primeiro assistente de IA e comece a transformar a experiência de aprendizado dos seus estudantes.
                  </p>
                  <Link to="/create-assistant">
                    <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-xl border-0 px-8 py-3">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeiro Assistente
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 bg-card/80 backdrop-blur-xl shadow-lg border border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center text-foreground">
                  <Zap className="h-5 w-5 mr-2 text-primary" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/create-assistant" className="block">
                  <Button variant="outline" className="w-full justify-start bg-card border-border text-foreground hover:bg-accent hover:text-foreground transition-all duration-300">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Assistente
                  </Button>
                </Link>
                <Link to="/transparency" className="block">
                  <Button variant="outline" className="w-full justify-start bg-card border-border text-foreground hover:bg-accent hover:text-foreground transition-all duration-300">
                    <Settings className="h-4 w-4 mr-2" />
                    Transparência da IA
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card className="border-0 bg-card/80 backdrop-blur-xl shadow-lg border border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center text-foreground">
                  <TrendingUp className="h-5 w-5 mr-2 text-secondary" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { icon: "🚀", text: "23 interações nos últimos 7 dias", color: "from-secondary to-secondary/80" },
                    { icon: "⭐", text: "2 novos feedbacks positivos", color: "from-primary to-primary/80" },
                    { icon: "✨", text: "1 assistente publicado hoje", color: "from-success to-success/80" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/60 hover:bg-muted/80 transition-all duration-300">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color}`}></div>
                      <p className="text-sm text-foreground flex-1">{item.text}</p>
                      <span className="text-lg">{item.icon}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tip */}
            <Card className="border-0 bg-gradient-to-br from-secondary/20 to-secondary/10 backdrop-blur-xl shadow-lg border border-secondary/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center text-foreground">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Dica Pro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  💡 Use o modo "transparência" para que os estudantes vejam como a IA chegou às respostas, criando uma experiência de aprendizado mais confiável.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
