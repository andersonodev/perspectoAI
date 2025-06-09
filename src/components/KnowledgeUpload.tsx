
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Trash2, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface KnowledgeItem {
  id: string;
  type: 'file' | 'text';
  title: string;
  content: string;
  file?: File;
}

interface KnowledgeUploadProps {
  onKnowledgeChange: (knowledge: KnowledgeItem[]) => void;
}

const KnowledgeUpload: React.FC<KnowledgeUploadProps> = ({ onKnowledgeChange }) => {
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [textTitle, setTextTitle] = useState('');
  const [textContent, setTextContent] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Erro",
        description: "Apenas arquivos PDF são suportados.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "Erro",
        description: "O arquivo deve ter no máximo 10MB.",
        variant: "destructive"
      });
      return;
    }

    const newKnowledge: KnowledgeItem = {
      id: Math.random().toString(36).substring(7),
      type: 'file',
      title: file.name,
      content: `Arquivo PDF: ${file.name}`,
      file
    };

    const updatedKnowledge = [...knowledge, newKnowledge];
    setKnowledge(updatedKnowledge);
    onKnowledgeChange(updatedKnowledge);
    
    event.target.value = '';
    
    toast({
      title: "Sucesso!",
      description: "PDF adicionado com sucesso!"
    });
  };

  const handleAddText = () => {
    if (!textTitle.trim() || !textContent.trim()) {
      toast({
        title: "Erro",
        description: "Título e conteúdo são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const newKnowledge: KnowledgeItem = {
      id: Math.random().toString(36).substring(7),
      type: 'text',
      title: textTitle,
      content: textContent
    };

    const updatedKnowledge = [...knowledge, newKnowledge];
    setKnowledge(updatedKnowledge);
    onKnowledgeChange(updatedKnowledge);
    
    setTextTitle('');
    setTextContent('');
    
    toast({
      title: "Sucesso!",
      description: "Texto adicionado com sucesso!"
    });
  };

  const removeKnowledge = (id: string) => {
    const updatedKnowledge = knowledge.filter(item => item.id !== id);
    setKnowledge(updatedKnowledge);
    onKnowledgeChange(updatedKnowledge);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload PDF */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Upload de PDF
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Faça upload de PDFs com o material da sua aula.
              </p>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Clique para fazer upload</span>
                    </p>
                    <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Text */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Adicionar Texto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="textTitle">Título</Label>
                <Input
                  id="textTitle"
                  value={textTitle}
                  onChange={(e) => setTextTitle(e.target.value)}
                  placeholder="Ex: Capítulo 1 - Introdução"
                />
              </div>
              <div>
                <Label htmlFor="textContent">Conteúdo</Label>
                <Textarea
                  id="textContent"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Cole aqui o texto do material..."
                  rows={4}
                />
              </div>
              <Button onClick={handleAddText} className="w-full">
                Adicionar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Knowledge List */}
      {knowledge.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Material Adicionado ({knowledge.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {knowledge.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                          {item.type === 'file' ? 'PDF' : 'Texto'}
                        </Badge>
                        {item.file && (
                          <span className="text-xs text-gray-500">
                            {(item.file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeKnowledge(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KnowledgeUpload;
