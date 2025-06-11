
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Plus, X, Loader2, Youtube, Link, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface KnowledgeSource {
  id: string;
  type: 'file' | 'text' | 'youtube' | 'url';
  title: string;
  content?: string;
  file?: File;
  url?: string;
  status: 'pending' | 'processing' | 'ready' | 'error';
}

interface MultipleKnowledgeUploadProps {
  onKnowledgeChange: (sources: KnowledgeSource[]) => void;
  initialSources?: KnowledgeSource[];
}

const MultipleKnowledgeUpload = ({ onKnowledgeChange, initialSources = [] }: MultipleKnowledgeUploadProps) => {
  const [sources, setSources] = useState<KnowledgeSource[]>(initialSources);
  const [uploadType, setUploadType] = useState<'file' | 'text' | 'youtube' | 'url'>('file');

  const addSource = () => {
    const newSource: KnowledgeSource = {
      id: Date.now().toString(),
      type: uploadType,
      title: '',
      status: 'pending'
    };
    
    const updatedSources = [...sources, newSource];
    setSources(updatedSources);
    onKnowledgeChange(updatedSources);
  };

  const updateSource = (id: string, updates: Partial<KnowledgeSource>) => {
    const updatedSources = sources.map(source => 
      source.id === id ? { ...source, ...updates } : source
    );
    setSources(updatedSources);
    onKnowledgeChange(updatedSources);
  };

  const removeSource = (id: string) => {
    const updatedSources = sources.filter(source => source.id !== id);
    setSources(updatedSources);
    onKnowledgeChange(updatedSources);
  };

  const handleFileUpload = (id: string, file: File) => {
    if (!file.type.includes('pdf')) {
      toast({
        title: "Erro",
        description: "Apenas arquivos PDF são suportados no momento.",
        variant: "destructive"
      });
      return;
    }

    updateSource(id, {
      file,
      title: file.name,
      status: 'ready'
    });
  };

  const validateYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/;
    return youtubeRegex.test(url);
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const renderSourceForm = (source: KnowledgeSource) => {
    return (
      <Card key={source.id} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center">
              {source.type === 'file' && <FileText className="h-4 w-4 mr-2" />}
              {source.type === 'youtube' && <Youtube className="h-4 w-4 mr-2" />}
              {source.type === 'url' && <Link className="h-4 w-4 mr-2" />}
              {source.type === 'text' && <FileText className="h-4 w-4 mr-2" />}
              {source.type === 'file' && 'Arquivo PDF'}
              {source.type === 'youtube' && 'Vídeo YouTube'}
              {source.type === 'url' && 'Link/URL'}
              {source.type === 'text' && 'Texto'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeSource(source.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <Label htmlFor={`title-${source.id}`}>Título</Label>
              <Input
                id={`title-${source.id}`}
                value={source.title}
                onChange={(e) => updateSource(source.id, { title: e.target.value })}
                placeholder="Digite um título para esta fonte"
              />
            </div>

            {source.type === 'file' && (
              <div>
                <Label htmlFor={`file-${source.id}`}>Arquivo PDF</Label>
                <Input
                  id={`file-${source.id}`}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(source.id, file);
                  }}
                />
              </div>
            )}

            {source.type === 'youtube' && (
              <div>
                <Label htmlFor={`youtube-${source.id}`}>URL do YouTube</Label>
                <Input
                  id={`youtube-${source.id}`}
                  value={source.url || ''}
                  onChange={(e) => {
                    const url = e.target.value;
                    const isValid = validateYouTubeUrl(url);
                    updateSource(source.id, { 
                      url, 
                      status: isValid ? 'ready' : 'pending' 
                    });
                  }}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            )}

            {source.type === 'url' && (
              <div>
                <Label htmlFor={`url-${source.id}`}>URL/Link</Label>
                <Input
                  id={`url-${source.id}`}
                  value={source.url || ''}
                  onChange={(e) => {
                    const url = e.target.value;
                    const isValid = validateUrl(url);
                    updateSource(source.id, { 
                      url, 
                      status: isValid ? 'ready' : 'pending' 
                    });
                  }}
                  placeholder="https://example.com/artigo"
                />
              </div>
            )}

            {source.type === 'text' && (
              <div>
                <Label htmlFor={`text-${source.id}`}>Conteúdo</Label>
                <Textarea
                  id={`text-${source.id}`}
                  value={source.content || ''}
                  onChange={(e) => {
                    const content = e.target.value;
                    updateSource(source.id, { 
                      content, 
                      status: content.trim() ? 'ready' : 'pending' 
                    });
                  }}
                  placeholder="Cole ou digite o conteúdo aqui..."
                  rows={4}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Base de Conhecimento</h3>
        <p className="text-sm text-gray-600">
          Adicione múltiplas fontes de conhecimento para enriquecer seu assistente.
        </p>
      </div>

      {/* Tipo de upload */}
      <div className="grid grid-cols-4 gap-2">
        <Button
          variant={uploadType === 'file' ? 'default' : 'outline'}
          onClick={() => setUploadType('file')}
          className="flex flex-col p-4 h-auto"
        >
          <Upload className="h-5 w-5 mb-1" />
          <span className="text-xs">PDF</span>
        </Button>
        <Button
          variant={uploadType === 'youtube' ? 'default' : 'outline'}
          onClick={() => setUploadType('youtube')}
          className="flex flex-col p-4 h-auto"
        >
          <Youtube className="h-5 w-5 mb-1" />
          <span className="text-xs">YouTube</span>
        </Button>
        <Button
          variant={uploadType === 'url' ? 'default' : 'outline'}
          onClick={() => setUploadType('url')}
          className="flex flex-col p-4 h-auto"
        >
          <Link className="h-5 w-5 mb-1" />
          <span className="text-xs">Link</span>
        </Button>
        <Button
          variant={uploadType === 'text' ? 'default' : 'outline'}
          onClick={() => setUploadType('text')}
          className="flex flex-col p-4 h-auto"
        >
          <FileText className="h-5 w-5 mb-1" />
          <span className="text-xs">Texto</span>
        </Button>
      </div>

      {/* Botão para adicionar fonte */}
      <Button onClick={addSource} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Adicionar {uploadType === 'file' && 'PDF'}
        {uploadType === 'youtube' && 'Vídeo YouTube'}
        {uploadType === 'url' && 'Link'}
        {uploadType === 'text' && 'Texto'}
      </Button>

      {/* Lista de fontes */}
      <div className="space-y-4">
        {sources.map(renderSourceForm)}
      </div>

      {sources.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>Nenhuma fonte de conhecimento adicionada ainda.</p>
          <p className="text-sm">Clique em "Adicionar" para começar.</p>
        </div>
      )}

      <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">💡 Dicas para múltiplas fontes:</h4>
        <ul className="space-y-1">
          <li>• Misture diferentes tipos de conteúdo para um assistente mais rico</li>
          <li>• Vídeos do YouTube são ótimos para explicações práticas</li>
          <li>• PDFs funcionam melhor para conteúdo estruturado e teórico</li>
          <li>• Links externos podem trazer perspectivas atualizadas</li>
        </ul>
      </div>
    </div>
  );
};

export default MultipleKnowledgeUpload;
