
-- Tabela para itens de revisão espaçada
CREATE TABLE IF NOT EXISTS spaced_repetition_items (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  assistant_id text REFERENCES ai_assistants(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  topic text NOT NULL,
  last_reviewed timestamptz DEFAULT now(),
  next_review timestamptz NOT NULL,
  difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  streak integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Tabela para conhecimento pessoal (Segunda Mente)
CREATE TABLE IF NOT EXISTS personal_knowledge (
  id text PRIMARY KEY,
  assistant_id text REFERENCES ai_assistants(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  title text NOT NULL,
  type text CHECK (type IN ('note', 'image', 'link', 'file')) NOT NULL,
  content text NOT NULL,
  source text NOT NULL,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Tabela para planos de estudo
CREATE TABLE IF NOT EXISTS study_plans (
  id text PRIMARY KEY,
  assistant_id text REFERENCES ai_assistants(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  subject text NOT NULL,
  exam_date timestamptz NOT NULL,
  chapters text[] NOT NULL,
  tasks jsonb NOT NULL DEFAULT '[]',
  total_estimated_hours numeric DEFAULT 0,
  completed_hours numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Tabela para conversas de estudantes (aprimorada)
CREATE TABLE IF NOT EXISTS student_conversations (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  assistant_id text REFERENCES ai_assistants(id) ON DELETE CASCADE,
  student_session_id text NOT NULL,
  message text NOT NULL,
  response text NOT NULL,
  sources text[] DEFAULT '{}',
  extracted_topic text,
  response_type text DEFAULT 'regular',
  created_at timestamptz DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_spaced_repetition_next_review ON spaced_repetition_items(next_review);
CREATE INDEX IF NOT EXISTS idx_spaced_repetition_session ON spaced_repetition_items(session_id);
CREATE INDEX IF NOT EXISTS idx_personal_knowledge_session ON personal_knowledge(session_id);
CREATE INDEX IF NOT EXISTS idx_study_plans_session ON study_plans(session_id);
CREATE INDEX IF NOT EXISTS idx_student_conversations_session ON student_conversations(student_session_id);

-- RLS Policies
ALTER TABLE spaced_repetition_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_conversations ENABLE ROW LEVEL SECURITY;

-- Policies para acesso público (estudantes)
CREATE POLICY "Allow public access to spaced_repetition_items" ON spaced_repetition_items FOR ALL USING (true);
CREATE POLICY "Allow public access to personal_knowledge" ON personal_knowledge FOR ALL USING (true);
CREATE POLICY "Allow public access to study_plans" ON study_plans FOR ALL USING (true);
CREATE POLICY "Allow public access to student_conversations" ON student_conversations FOR ALL USING (true);
