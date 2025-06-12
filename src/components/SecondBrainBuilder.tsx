
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Brain, Upload, FileText, Camera, Link, Trash2, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PersonalKnowledge } from '@/types/database';

interface PersonalKnowledgeItem {
  id: string;
  title: string;
  type: 'note' | 'image' | 'link' | 'file';
  content: string;
  source: string;
  createdAt: Date;
  tags: string[];
}

interface SecondBrainBuilderProps {
  assistantId: string;
  sessionId: string;
  onKnowledgeUpdate: () => void;
}

const SecondBrainBuilder = ({ assistantId, sessionId, onKnowledgeUpdate }: SecondBrainBuilderProps) => {
  const [personalKnowledge, setPersonalKnowledge] = useState<PersonalKnowledgeItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newItem, setNewItem] = useState({
    title: '',
    type: 'note' as const,
    content: '',
    source: '',
    tags: ''
  });

  const processImageWithOCR = async (file: File): Promise<string> => {
    // Simulação de OCR - em produção, usaria uma API como Google Vision ou Tesseract.js
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`[Texto extraído da imagem: ${file.name}]\n\nEste é um exemplo de texto que seria extraído da imagem usando OCR. Em uma implementação real, o texto seria processado por uma API de reconhecimento ótico de caracteres.`);
      }, 2000);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      let content = '';
      let type: 'note' | 'image' | 'link' | 'file' = 'file';

      if (file.type.startsWith('image/')) {
        type = 'image';
        content = await processImageWithOCR(file);
      } else if (file.type === 'application/pdf') {
        content = `[Conteúdo do PDF: ${file.name}]\n\nProcessando documento PDF...`;
      } else {
        content = `[Arquivo: ${file.name}]\n\nTipo: ${file.type}`;
      }

      clearInterval(progressInterval);
      setUploadProgress(100);

      const newKnowledgeItem: PersonalKnowledgeItem = {
        id: Date.now().toString(),
        title: file.name,
        type,
        content,
        source: 'Upload pessoal',
        createdAt: new Date(),
        tags: []
      };

      await saveKnowledgeItem(newKnowledgeItem);
      
      toast({
        title: "Arquivo processado!",
        description: `${file.name} foi adicionado à sua Segunda Mente.`
      });

    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar o arquivo.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const saveKnowledgeItem = async (item: PersonalKnowledgeItem) => {
    try {
      const { error } = await (supabase as any)
        .from('personal_knowledge')
        .insert({
          id: item.id,
          assistant_id: assistantId,
          session_id: sessionId,
          title: item.title,
          type: item.type,
          content: item.content,
          source: item.source,
          tags: item.tags
        });

      if (error) throw error;

      setPersonalKnowledge(prev => [...prev, item]);
      onKnowledgeUpdate();
    } catch (error) {
      console.error('Error saving knowledge item:', error);
      throw error;
    }
  };

  const addManualItem = async () => {
    if (!newItem.title.trim() || !newItem.content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Título e conteúdo são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const item: PersonalKnowledgeItem = {
      id: Date.now().toString(),
      title: newItem.title,
      type: newItem.type,
      content: newItem.content,
      source: newItem.source || 'Adição manual',
      createdAt: new Date(),
      tags: newItem.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    try {
      await saveKnowledgeItem(item);
      
      setNewItem({
        title: '',
        type: 'note',
        content: '',
        source: '',
        tags: ''
      });

      toast({
        title: "Item adicionado!",
        description: "O conteúdo foi adicionado à sua Segunda Mente."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o item.",
        variant: "destructive"
      });
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('personal_knowledge')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPersonalKnowledge(prev => prev.filter(item => item.id !== id));
      onKnowledgeUpdate();

      toast({
        title: "Item removido",
        description: "O item foi removido da sua Segunda Mente."
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o item.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2 text-purple-600" />
          Minha Segunda Mente
        </CardTitle>
        <p className="text-sm text-gray-600">
          Adicione suas próprias anotações, fotos e materiais para criar seu banco de conhecimento pessoal.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload de Arquivos */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-4">
              Arraste arquivos aqui ou clique para selecionar
            </p>
            <Input
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.jpg,.jpeg,.png,.txt,.docx"
              className="hidden"
              id="file-upload"
              disabled={uploading}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={uploading}
            >
              <Camera className="h-4 w-4 mr-2" />
              Selecionar Arquivo
            </Button>
          </div>
          
          {uploading && (
            <div className="mt-4">
              <Progress value={uploadProgress} className="mb-2" />
              <p className="text-sm text-gray-600 text-center">
                Processando arquivo... {uploadProgress}%
              </p>
            </div>
          )}
        </div>

        {/* Adição Manual */}
        <div className="space-y-4 border rounded-lg p-4">
          <h4 className="font-medium">Adicionar Conteúdo Manual</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={newItem.title}
                onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Anotações da aula de Biologia"
              />
            </div>
            <div>
              <Label htmlFor="source">Fonte (opcional)</Label>
              <Input
                id="source"
                value={newItem.source}
                onChange={(e) => setNewItem(prev => ({ ...prev, source: e.target.value }))}
                placeholder="Ex: Livro Capítulo 5, Aula do dia 15/03"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              value={newItem.content}
              onChange={(e) => setNewItem(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Cole ou digite o conteúdo aqui..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
            <Input
              id="tags"
              value={newItem.tags}
              onChange={(e) => setNewItem(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="Ex: biologia, células, mitose"
            />
          </div>

          <Button onClick={addManualItem}>
            <FileText className="h-4 w-4 mr-2" />
            Adicionar à Segunda Mente
          </Button>
        </div>

        {/* Lista de Conhecimento Pessoal */}
        <div className="space-y-3">
          <h4 className="font-medium">Seu Conhecimento Pessoal ({personalKnowledge.length} itens)</h4>
          
          {personalKnowledge.map(item => (
            <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {item.type === 'image' && <Camera className="h-4 w-4 text-blue-600" />}
                    {item.type === 'note' && <FileText className="h-4 w-4 text-green-600" />}
                    {item.type === 'link' && <Link className="h-4 w-4 text-purple-600" />}
                    {item.type === 'file' && <Upload className="h-4 w-4 text-orange-600" />}
                    <h5 className="font-medium">{item.title}</h5>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {item.content.substring(0, 150)}...
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Fonte: {item.source}</span>
                    <span>{item.createdAt.toLocaleDateString()}</span>
                    {item.tags.length > 0 && (
                      <span>Tags: {item.tags.join(', ')}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {personalKnowledge.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Brain className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Sua Segunda Mente está vazia.</p>
              <p className="text-sm">Adicione conteúdos para começar a construir seu banco de conhecimento pessoal!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SecondBrainBuilder;
