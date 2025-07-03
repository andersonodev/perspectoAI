import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileImage, 
  Sparkles, 
  Brain, 
  RotateCcw,
  Check,
  X,
  Crown,
  Zap
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

const FlashcardGenerator = () => {
  const [step, setStep] = useState<'input' | 'generating' | 'review'>('input');
  const [inputType, setInputType] = useState<'text' | 'image'>('text');
  const [textContent, setTextContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [generatedCards, setGeneratedCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [usageCount] = useState(2); // Simulated usage count
  const [maxUsage] = useState(3); // Free tier limit

  const handleGenerate = async () => {
    if (usageCount >= maxUsage) {
      toast({
        title: "Limite atingido",
        description: "Você atingiu o limite de 3 gerações de flashcards no plano gratuito. Faça upgrade para continuar!",
        variant: "destructive"
      });
      return;
    }

    if (inputType === 'text' && !textContent.trim()) {
      toast({
        title: "Conteúdo necessário",
        description: "Por favor, adicione o conteúdo para gerar os flashcards.",
        variant: "destructive"
      });
      return;
    }

    if (inputType === 'image' && !imageFile) {
      toast({
        title: "Imagem necessária",
        description: "Por favor, faça upload de uma imagem.",
        variant: "destructive"
      });
      return;
    }

    setStep('generating');

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock generated flashcards
    const mockCards: Flashcard[] = [
      {
        id: '1',
        question: 'O que é fotossíntese?',
        answer: 'Processo pelo qual as plantas convertem luz solar, água e dióxido de carbono em glicose e oxigênio.',
        difficulty: 'easy',
        category: 'Biologia'
      },
      {
        id: '2',
        question: 'Quais são os produtos da fotossíntese?',
        answer: 'Glicose (C₆H₁₂O₆) e oxigênio (O₂)',
        difficulty: 'medium',
        category: 'Biologia'
      },
      {
        id: '3',
        question: 'Onde ocorre a fotossíntese na célula vegetal?',
        answer: 'Nos cloroplastos, especificamente nos tilacoides e no estroma.',
        difficulty: 'hard',
        category: 'Biologia'
      },
      {
        id: '4',
        question: 'Qual é a equação geral da fotossíntese?',
        answer: '6CO₂ + 6H₂O + energia luminosa → C₆H₁₂O₆ + 6O₂',
        difficulty: 'medium',
        category: 'Biologia'
      }
    ];

    setGeneratedCards(mockCards);
    setStep('review');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % generatedCards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + generatedCards.length) % generatedCards.length);
    setIsFlipped(false);
  };

  if (step === 'generating') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Gerando seus flashcards...
          </h3>
          <p className="text-gray-600 mb-4">
            Nossa IA está analisando o conteúdo e criando perguntas inteligentes
          </p>
          <Progress value={66} className="mb-4" />
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>Analisando conteúdo</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Gerando perguntas</span>
            </div>
            <div className="flex items-center justify-center space-x-2 opacity-50">
              <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
              <span>Finalizando flashcards</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'review') {
    const currentCard = generatedCards[currentCardIndex];
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Flashcards Gerados ✨
            </h3>
            <p className="text-gray-600">
              {generatedCards.length} cards criados • {currentCardIndex + 1} de {generatedCards.length}
            </p>
          </div>
          <Button 
            onClick={() => setStep('input')}
            variant="outline"
            className="bg-white"
          >
            Gerar Novos
            <Sparkles className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Flashcard */}
        <Card className="w-full max-w-md mx-auto h-64 cursor-pointer group perspective-1000">
          <div 
            className={`relative w-full h-full transition-transform duration-500 preserve-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front */}
            <CardContent className="absolute inset-0 w-full h-full backface-hidden flex flex-col justify-center p-6 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-lg border-2 border-blue-200 group-hover:border-blue-300 transition-colors">
              <div className="text-center">
                <Badge className={`mb-4 ${getDifficultyColor(currentCard.difficulty)}`}>
                  {currentCard.difficulty === 'easy' && '😊 Fácil'}
                  {currentCard.difficulty === 'medium' && '🤔 Médio'}
                  {currentCard.difficulty === 'hard' && '🔥 Difícil'}
                </Badge>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 leading-relaxed">
                  {currentCard.question}
                </h4>
                <p className="text-sm text-gray-600">
                  Clique para ver a resposta
                </p>
              </div>
            </CardContent>

            {/* Back */}
            <CardContent className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex flex-col justify-center p-6 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg border-2 border-emerald-200 group-hover:border-emerald-300 transition-colors">
              <div className="text-center">
                <Badge className="mb-4 bg-emerald-100 text-emerald-800 border-emerald-200">
                  📚 {currentCard.category}
                </Badge>
                <p className="text-base text-gray-900 leading-relaxed">
                  {currentCard.answer}
                </p>
                <p className="text-sm text-gray-600 mt-4">
                  Clique para voltar à pergunta
                </p>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-center space-x-4">
          <Button 
            onClick={prevCard}
            variant="outline"
            size="sm"
            disabled={generatedCards.length <= 1}
            className="bg-white"
          >
            ← Anterior
          </Button>
          <span className="text-sm text-gray-600">
            {currentCardIndex + 1} / {generatedCards.length}
          </span>
          <Button 
            onClick={nextCard}
            variant="outline"
            size="sm"
            disabled={generatedCards.length <= 1}
            className="bg-white"
          >
            Próximo →
          </Button>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-3">
          <Button 
            className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white"
          >
            Salvar Flashcards
          </Button>
          <Button variant="outline" className="bg-white">
            Exportar PDF
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Usage Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            Gerador de Flashcards IA
          </h3>
          <p className="text-gray-600">
            Transforme qualquer conteúdo em flashcards inteligentes
          </p>
        </div>
        <div className="text-right">
          <Badge className={`${usageCount >= maxUsage ? 'bg-red-100 text-red-800 border-red-200' : 'bg-blue-100 text-blue-800 border-blue-200'}`}>
            {usageCount}/{maxUsage} usos hoje
          </Badge>
          {usageCount >= maxUsage && (
            <p className="text-xs text-red-600 mt-1">
              Limite atingido
            </p>
          )}
        </div>
      </div>

      {/* Input Type Selector */}
      <div className="flex space-x-2">
        <Button
          variant={inputType === 'text' ? 'default' : 'outline'}
          onClick={() => setInputType('text')}
          className={inputType === 'text' ? 'bg-blue-600 text-white' : 'bg-white'}
        >
          <FileImage className="h-4 w-4 mr-2" />
          Texto
        </Button>
        <Button
          variant={inputType === 'image' ? 'default' : 'outline'}
          onClick={() => setInputType('image')}
          className={inputType === 'image' ? 'bg-blue-600 text-white' : 'bg-white'}
        >
          <Upload className="h-4 w-4 mr-2" />
          Imagem
        </Button>
      </div>

      {/* Input Area */}
      {inputType === 'text' ? (
        <Card>
          <CardContent className="p-6">
            <Textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Cole aqui o conteúdo que você quer transformar em flashcards... 

Exemplo:
- Anotações de aula
- Trechos de livros
- Resumos
- Definições

Nossa IA vai analisar e criar perguntas inteligentes!"
              rows={8}
              className="bg-white resize-none"
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Upload de Imagem
              </h4>
              <p className="text-gray-600 mb-4">
                Envie uma foto das suas anotações, slides ou páginas de livro
              </p>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="max-w-xs mx-auto bg-white"
              />
              {imageFile && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ {imageFile.name}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate Button */}
      <div className="flex flex-col items-center space-y-4">
        <Button 
          onClick={handleGenerate}
          disabled={usageCount >= maxUsage || (inputType === 'text' && !textContent.trim()) || (inputType === 'image' && !imageFile)}
          className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white px-8 py-3 text-lg"
        >
          <Zap className="h-5 w-5 mr-2" />
          Gerar Flashcards Mágicos
        </Button>

        {usageCount >= maxUsage && (
          <Card className="max-w-md bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <Crown className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h4 className="font-semibold text-orange-900 mb-1">
                Limite do Plano Gratuito
              </h4>
              <p className="text-sm text-orange-800 mb-3">
                Faça upgrade para gerar flashcards ilimitados!
              </p>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                Upgrade Agora
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Dicas para melhores flashcards:
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use conteúdo claro e bem estruturado</li>
            <li>• Inclua definições, conceitos e fórmulas</li>
            <li>• Quanto mais contexto, melhores as perguntas</li>
            <li>• Para imagens, use textos legíveis e organizados</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlashcardGenerator;