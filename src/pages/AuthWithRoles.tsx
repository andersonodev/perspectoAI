
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Brain, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import RoleSelection from '@/components/RoleSelection';
import { UserRole } from '@/types/user';

const AuthWithRoles = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Here we would check the user's role from the profile
      // For now, redirect to educator dashboard
      navigate('/dashboard');
    }
  }, [user, navigate]);

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
      // Navigate based on role (for now, go to dashboard)
      navigate('/dashboard');
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
      // Here we would save the user role to the profile table
    }
    
    setLoading(false);
  };

  if (!showAuthForm) {
    return <RoleSelection onRoleSelect={handleRoleSelect} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-blue-100 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Mentor IA</h1>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => setShowAuthForm(false)}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Voltar
          </Button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                selectedRole === 'educator' 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                  : 'bg-gradient-to-br from-emerald-500 to-emerald-600'
              }`}>
                <Brain className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">
                {selectedRole === 'educator' ? 'Conta de Educador' : 'Conta de Estudante'}
              </CardTitle>
              <CardDescription>
                {selectedRole === 'educator' 
                  ? 'Crie e gerencie assistentes de IA para suas turmas'
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
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                          : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
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

export default AuthWithRoles;
