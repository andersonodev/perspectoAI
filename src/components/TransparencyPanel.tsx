
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, Lock, Users, FileText, AlertTriangle } from 'lucide-react';

const TransparencyPanel = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Transparência e Ética</h1>
        <p className="text-lg text-gray-600">
          Nossa promessa de responsabilidade e confiança na educação com IA
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coleta de Dados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2 text-blue-600" />
              Quais dados coletamos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-1">✓</Badge>
                <div>
                  <p className="font-medium text-gray-900">Conversas educacionais</p>
                  <p className="text-sm text-gray-600">
                    Para melhorar as respostas e identificar lacunas de conhecimento
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-1">✓</Badge>
                <div>
                  <p className="font-medium text-gray-900">Métricas de uso</p>
                  <p className="text-sm text-gray-600">
                    Tempo de sessão, tópicos mais consultados (dados anonimizados)
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-1">✗</Badge>
                <div>
                  <p className="font-medium text-gray-900">Dados pessoais sensíveis</p>
                  <p className="text-sm text-gray-600">
                    Nunca coletamos CPF, endereço, telefone ou informações familiares
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proteção de Dados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2 text-green-600" />
              Como protegemos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-1 bg-green-50 text-green-700">✓</Badge>
                <div>
                  <p className="font-medium text-gray-900">Anonimização automática</p>
                  <p className="text-sm text-gray-600">
                    Analytics nunca contêm nomes ou identificadores pessoais
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-1 bg-green-50 text-green-700">✓</Badge>
                <div>
                  <p className="font-medium text-gray-900">Criptografia total</p>
                  <p className="text-sm text-gray-600">
                    Todas as conversas são criptografadas em trânsito e em repouso
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-1 bg-green-50 text-green-700">✓</Badge>
                <div>
                  <p className="font-medium text-gray-900">LGPD compliant</p>
                  <p className="text-sm text-gray-600">
                    Total conformidade com a Lei Geral de Proteção de Dados
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Limites da IA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
              Limites da IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Badge variant="destructive" className="mt-1">⚠</Badge>
                <div>
                  <p className="font-medium text-gray-900">Não é terapeuta</p>
                  <p className="text-sm text-gray-600">
                    Para questões de saúde mental, procure um profissional
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="destructive" className="mt-1">⚠</Badge>
                <div>
                  <p className="font-medium text-gray-900">Não dá conselhos médicos</p>
                  <p className="text-sm text-gray-600">
                    Questões de saúde devem ser direcionadas a médicos
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="destructive" className="mt-1">⚠</Badge>
                <div>
                  <p className="font-medium text-gray-900">Não substitui o professor</p>
                  <p className="text-sm text-gray-600">
                    É uma ferramenta de apoio, não um substituto para a educação humana
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compromissos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-purple-600" />
              Nossos compromissos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-1 bg-purple-50 text-purple-700">♥</Badge>
                <div>
                  <p className="font-medium text-gray-900">Transparência total</p>
                  <p className="text-sm text-gray-600">
                    Sempre explicamos como chegamos às respostas
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-1 bg-purple-50 text-purple-700">♥</Badge>
                <div>
                  <p className="font-medium text-gray-900">Melhoria contínua</p>
                  <p className="text-sm text-gray-600">
                    Usamos feedback para tornar a IA mais útil e segura
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-1 bg-purple-50 text-purple-700">♥</Badge>
                <div>
                  <p className="font-medium text-gray-900">Educação responsável</p>
                  <p className="text-sm text-gray-600">
                    Promovemos o aprendizado autêntico, não a dependência
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contato */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-gray-600" />
            Dúvidas ou preocupações?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-3">
              Acreditamos que a transparência gera confiança. Se você tem alguma dúvida 
              sobre como usamos os dados ou como a IA funciona, entre em contato conosco.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">📧 privacidade@mentorai.com</Badge>
              <Badge variant="outline">📞 (11) 99999-9999</Badge>
              <Badge variant="outline">💬 Chat ao vivo no site</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data da última atualização */}
      <div className="text-center text-sm text-gray-500">
        <p>Última atualização desta política: {new Date().toLocaleDateString('pt-BR')}</p>
      </div>
    </div>
  );
};

export default TransparencyPanel;
