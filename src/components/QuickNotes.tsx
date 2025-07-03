import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  StickyNote, 
  Plus, 
  Trash2, 
  Pin,
  Clock,
  Edit3,
  Save,
  X
} from 'lucide-react';

interface Note {
  id: string;
  content: string;
  timestamp: Date;
  pinned: boolean;
}

interface QuickNotesProps {
  className?: string;
}

const QuickNotes: React.FC<QuickNotesProps> = ({ className = "" }) => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      content: 'Revisar capítulo 3 de química orgânica',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      pinned: true
    },
    {
      id: '2', 
      content: 'Fazer exercícios de matemática da página 45-50',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      pinned: false
    }
  ]);
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const addNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote.trim(),
        timestamp: new Date(),
        pinned: false
      };
      setNotes([note, ...notes]);
      setNewNote('');
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const togglePin = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, pinned: !note.pinned } : note
    ).sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.timestamp.getTime() - a.timestamp.getTime();
    }));
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const saveEdit = () => {
    if (editingId && editContent.trim()) {
      setNotes(notes.map(note => 
        note.id === editingId 
          ? { ...note, content: editContent.trim(), timestamp: new Date() }
          : note
      ));
      setEditingId(null);
      setEditContent('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return `${Math.floor(diffInMinutes / 1440)}d atrás`;
  };

  return (
    <Card className={`feature-card ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <StickyNote className="h-5 w-5 text-secondary" />
          Notas Rápidas
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Add New Note */}
        <div className="space-y-2">
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Adicionar nova nota..."
            className="resize-none h-20 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                addNote();
              }
            }}
          />
          <Button
            onClick={addNote}
            disabled={!newNote.trim()}
            size="sm"
            className="w-full student-button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Nota
          </Button>
        </div>

        {/* Notes List */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-3 rounded-xl border transition-all duration-300 ${
                note.pinned 
                  ? 'bg-secondary/10 border-secondary/30' 
                  : 'bg-card border-border hover:border-border/60'
              }`}
            >
              {editingId === note.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="resize-none h-16 text-sm"
                  />
                  <div className="flex gap-2">
                    <Button onClick={saveEdit} size="sm" variant="outline">
                      <Save className="h-3 w-3" />
                    </Button>
                    <Button onClick={cancelEdit} size="sm" variant="outline">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm text-foreground flex-1 leading-relaxed">
                      {note.content}
                    </p>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        onClick={() => togglePin(note.id)}
                        variant="ghost"
                        size="sm"
                        className={`h-6 w-6 p-0 ${note.pinned ? 'text-secondary' : 'text-muted-foreground'}`}
                      >
                        <Pin className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={() => startEdit(note)}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={() => deleteNote(note.id)}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(note.timestamp)}
                    </div>
                    {note.pinned && (
                      <Badge className="bg-secondary/20 text-secondary border-secondary/30 text-xs">
                        Fixada
                      </Badge>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
          
          {notes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <StickyNote className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma nota ainda</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickNotes;