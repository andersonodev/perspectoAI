import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Brain, GraduationCap, BookOpen, AlertCircle, Users, Sparkles, Target, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserRole } from '@/types/user';

const UnifiedAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Check if user is being invited to a class
  const inviteCode = searchParams.get('invite');

  useEffect(() => {
    if (user) {
      // Here we would check the user's role from the profile
      // For now, redirect based on selected role or default to educator
      if (selectedRole === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate, selectedRole]);

  useEffect(() => {
    // If there's an invite code, pre-select student role
    if (inviteCode) {
      setSelectedRole('student');
      setShowAuthForm(true);
    }
  }, [inviteCode]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setShowAuthForm(true);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro ao fazer login",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Bem-vindo de volta!",
        description: "Login realizado com sucesso."
      });
      
      // Navigate based on role
      if (selectedRole === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signUp(email, password);
    
    if (error) {
      console.error('Signup error:', error);
      toast({
        title: "Erro ao criar conta",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setShowEmailConfirmation(true);
      toast({
        title: "Conta criada!",
        description: "Verifique seu email para ativar a conta."
      });
    }
    
    setLoading(false);
  };

  if (!showAuthForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Brain className="h-12 w-12 text-slate-700 mr-3" />
              <h1 className="text-4xl font-bold text-slate-900">Mentor IA</h1>
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              {inviteCode ? "Você foi convidado para uma turma!" : "Como você quer usar nossa plataforma?"}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {inviteCode 
                ? "Complete seu cadastro para acessar o conteúdo da turma e começar a aprender"
                : "Escolha seu perfil para ter uma experiência personalizada com ferramentas de IA educacional"
              }
            </p>
          </div>

          {inviteCode && (
            <div className="mb-8 flex justify-center">
              <Alert className="max-w-md bg-emerald-50/80 border-emerald-200/60 backdrop-blur-sm">
                <Users className="h-4 w-4 text-emerald-700" />
                <AlertDescription className="text-emerald-800">
                  Convite para turma: <strong>{inviteCode}</strong>
                </AlertDescription>
              </Alert>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Educador */}
            <Card 
              className={`group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 hover:border-slate-300 bg-white/95 backdrop-blur-sm cursor-pointer ${
                inviteCode ? 'opacity-50 pointer-events-none' : ''
              }`}
              onClick={() => !inviteCode && handleRoleSelect('educator')}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-slate-900">Sou Educador</CardTitle>
                <p className="text-slate-700 font-medium">Quero criar assistentes e gerenciar turmas</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Brain className="h-5 w-5 text-slate-700" />
                    <span className="text-slate-700">Criar assistentes de IA personalizados</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-slate-700" />
                    <span className="text-slate-700">Gerenciar turmas e estudantes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-slate-700" />
                    <span className="text-slate-700">Analytics avançadas de aprendizado</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-slate-700" />
                    <span className="text-slate-700">Upload de materiais didáticos</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleRoleSelect('educator')}
                  className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                  disabled={!!inviteCode}
                >
                  Começar como Educador
                </Button>
              </CardContent>
            </Card>

            {/* Estudante */}
            <Card 
              className={`group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 hover:border-emerald-300 bg-white/95 backdrop-blur-sm cursor-pointer ${
                inviteCode ? 'ring-2 ring-emerald-400/60 ring-opacity-50' : ''
              }`}
              onClick={() => handleRoleSelect('student')}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-emerald-900">Sou Estudante</CardTitle>
                <p className="text-emerald-700 font-medium">
                  {inviteCode ? "Acessar turma e ferramentas de estudo" : "Quero aprender e usar ferramentas de estudo"}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="h-5 w-5 text-emerald-700" />
                    <span className="text-slate-700">Super-tutor pessoal com IA</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Brain className="h-5 w-5 text-emerald-700" />
                    <span className="text-slate-700">Criar assistentes de estudo personalizados</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-emerald-700" />
                    <span className="text-slate-700">Flashcards e mapas mentais automáticos</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-emerald-700" />
                    <span className="text-slate-700">
                      {inviteCode ? "Acesso imediato à turma" : "Participar de turmas"}
                    </span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleRoleSelect('student')}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  {inviteCode ? "Acessar Turma" : "Começar como Estudante"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-slate-600">
              Já tem uma conta? 
              <button 
                onClick={() => setShowAuthForm(true)}
                className="text-slate-700 hover:text-slate-900 font-medium ml-1 underline decoration-2 underline-offset-2 hover:decoration-amber-600 transition-colors"
              >
                Fazer login
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-slate-700" />
            <h1 className="text-2xl font-bold text-slate-900">Mentor IA</h1>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => setShowAuthForm(false)}
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            ← Voltar
          </Button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="bg-white/95 backdrop-blur-sm border border-slate-200 shadow-xl">
            <CardHeader className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                selectedRole === 'educator' 
                  ? 'bg-gradient-to-br from-slate-700 to-slate-800' 
                  : 'bg-gradient-to-br from-emerald-600 to-emerald-700'
              }`}>
                <Brain className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-slate-900">
                {selectedRole === 'educator' ? 'Conta de Educador' : 'Conta de Estudante'}
              </CardTitle>
              <CardDescription className="text-slate-600">
                {selectedRole === 'educator' 
                  ? 'Crie e gerencie assistentes de IA para suas turmas'
                  : inviteCode 
                    ? `Acesse a turma ${inviteCode} e ferramentas de estudo`
                    : 'Acesse ferramentas inteligentes para potencializar seus estudos'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showEmailConfirmation && (
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Conta criada com sucesso! Verifique seu email para confirmar sua conta antes de fazer login.
                  </AlertDescription>
                </Alert>
              )}

              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Entrar</TabsTrigger>
                  <TabsTrigger value="signup">Criar conta</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-white"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className={`w-full ${
                        selectedRole === 'educator'
                          ? 'bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900'
                          : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800'
                      } text-white shadow-lg`}
                      disabled={loading}
                    >
                      {loading ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Senha</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="bg-white"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className={`w-full ${
                        selectedRole === 'educator'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                          : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
                      } text-white shadow-lg`}
                      disabled={loading}
                    >
                      {loading ? "Criando conta..." : "Criar conta"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UnifiedAuth;