
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Plus, X, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useKnowledge } from '@/hooks/useKnowledge';

interface KnowledgeUploadProps {
  assistantId: string;
}

const KnowledgeUpload = ({ assistantId }: KnowledgeUploadProps) => {
  const { addKnowledge } = useKnowledge();
  const [uploadType, setUploadType] = useState<'file' | 'text' | 'url'>('file');
  const [loading, setLoading] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.type.includes('pdf')) {
      toast({
        title: "Erro",
        description: "Apenas arquivos PDF são suportados no momento.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Erro ao processar PDF');

      const { content } = await response.json();

      await addKnowledge({
        assistant_id: assistantId,
        content_type: 'file',
        title: file.name,
        content: content,
        source_info: { 
          filename: file.name, 
          size: file.size,
          type: file.type 
        }
      });

      toast({
        title: "Sucesso",
        description: "Arquivo processado e adicionado à base de conhecimento!"
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar o arquivo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!textContent.trim() || !textTitle.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha título e conteúdo.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await addKnowledge({
        assistant_id: assistantId,
        content_type: 'text',
        title: textTitle,
        content: textContent,
        source_info: { 
          length: textContent.length,
          created_at: new Date().toISOString()
        }
      });

      toast({
        title: "Sucesso",
        description: "Conteúdo adicionado à base de conhecimento!"
      });

      setTextContent('');
      setTextTitle('');
    } catch (error) {
      console.error('Error adding text:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o conteúdo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Type Selection */}
      <div className="flex space-x-2">
        <Button
          variant={uploadType === 'file' ? 'default' : 'outline'}
          onClick={() => setUploadType('file')}
          className="flex-1"
        >
          <Upload className="h-4 w-4 mr-2" />
          Arquivo PDF
        </Button>
        <Button
          variant={uploadType === 'text' ? 'default' : 'outline'}
          onClick={() => setUploadType('text')}
          className="flex-1"
        >
          <FileText className="h-4 w-4 mr-2" />
          Texto
        </Button>
      </div>

      {/* File Upload */}
      {uploadType === 'file' && (
        <Card>
          <CardHeader>
            <CardTitle>Upload de Arquivo PDF</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                disabled={loading}
              />
              {loading && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Processando arquivo...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Text Input */}
      {uploadType === 'text' && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Conteúdo de Texto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="text-title">Título</Label>
                <Input
                  id="text-title"
                  value={textTitle}
                  onChange={(e) => setTextTitle(e.target.value)}
                  placeholder="Ex: Conceitos fundamentais de Física"
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="text-content">Conteúdo</Label>
                <Textarea
                  id="text-content"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Cole ou digite o conteúdo que você quer adicionar à base de conhecimento..."
                  rows={8}
                  disabled={loading}
                />
              </div>
              <Button
                onClick={handleTextSubmit}
                disabled={loading || !textContent.trim() || !textTitle.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Adicionando...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Conteúdo
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">💡 Dicas para otimizar a base de conhecimento:</h4>
        <ul className="space-y-1">
          <li>• PDFs com texto selecionável funcionam melhor que imagens escaneadas</li>
          <li>• Organize o conteúdo em tópicos claros para melhor recuperação</li>
          <li>• Adicione contexto e exemplos para enriquecer as respostas da IA</li>
        </ul>
      </div>
    </div>
  );
};

export default KnowledgeUpload;
