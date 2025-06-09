
-- Remove existing RLS policies for ai_assistants if any
DROP POLICY IF EXISTS "Users can view their own assistants" ON public.ai_assistants;
DROP POLICY IF EXISTS "Users can create their own assistants" ON public.ai_assistants;
DROP POLICY IF EXISTS "Users can update their own assistants" ON public.ai_assistants;
DROP POLICY IF EXISTS "Users can delete their own assistants" ON public.ai_assistants;
DROP POLICY IF EXISTS "Public can view published assistants" ON public.ai_assistants;

-- Enable RLS on ai_assistants table
ALTER TABLE public.ai_assistants ENABLE ROW LEVEL SECURITY;

-- Policy for users to manage their own assistants
CREATE POLICY "Users can manage their own assistants" 
  ON public.ai_assistants 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Policy for public access to published assistants (for students)
CREATE POLICY "Public can view published assistants" 
  ON public.ai_assistants 
  FOR SELECT 
  USING (is_published = true);

-- Add table for conversation history
CREATE TABLE IF NOT EXISTS public.conversation_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  assistant_id UUID REFERENCES public.ai_assistants(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on conversation_sessions
ALTER TABLE public.conversation_sessions ENABLE ROW LEVEL SECURITY;

-- Policy for public access to conversation sessions (students don't need auth)
CREATE POLICY "Public can manage conversation sessions" 
  ON public.conversation_sessions 
  FOR ALL 
  USING (true);

-- Add feedback table for thumbs up/down
CREATE TABLE IF NOT EXISTS public.message_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assistant_id UUID REFERENCES public.ai_assistants(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  message_index INTEGER NOT NULL,
  feedback INTEGER NOT NULL CHECK (feedback IN (-1, 1)), -- -1 for thumbs down, 1 for thumbs up
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on message_feedback
ALTER TABLE public.message_feedback ENABLE ROW LEVEL SECURITY;

-- Policy for public access to message feedback
CREATE POLICY "Public can manage message feedback" 
  ON public.message_feedback 
  FOR ALL 
  USING (true);

-- Add analytics table for tracking usage
CREATE TABLE IF NOT EXISTS public.assistant_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assistant_id UUID REFERENCES public.ai_assistants(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  messages_count INTEGER NOT NULL DEFAULT 0,
  session_duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on assistant_analytics
ALTER TABLE public.assistant_analytics ENABLE ROW LEVEL SECURITY;

-- Policy for users to view analytics of their assistants
CREATE POLICY "Users can view analytics of their assistants" 
  ON public.assistant_analytics 
  FOR SELECT 
  USING (
    assistant_id IN (
      SELECT id FROM public.ai_assistants WHERE user_id = auth.uid()
    )
  );

-- Policy for public to insert analytics (students don't need auth)
CREATE POLICY "Public can insert analytics" 
  ON public.assistant_analytics 
  FOR INSERT 
  WITH CHECK (true);

-- Add knowledge gaps table
CREATE TABLE IF NOT EXISTS public.knowledge_gaps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assistant_id UUID REFERENCES public.ai_assistants(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  frequency INTEGER NOT NULL DEFAULT 1,
  first_asked TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_asked TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on knowledge_gaps
ALTER TABLE public.knowledge_gaps ENABLE ROW LEVEL SECURITY;

-- Policy for users to view knowledge gaps of their assistants
CREATE POLICY "Users can view knowledge gaps of their assistants" 
  ON public.knowledge_gaps 
  FOR SELECT 
  USING (
    assistant_id IN (
      SELECT id FROM public.ai_assistants WHERE user_id = auth.uid()
    )
  );

-- Policy for public to manage knowledge gaps
CREATE POLICY "Public can manage knowledge gaps" 
  ON public.knowledge_gaps 
  FOR ALL 
  USING (true);
