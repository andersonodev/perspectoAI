
export interface AIAssistant {
  id: string;
  user_id: string;
  name: string;
  subject: string;
  personality: 'friendly' | 'formal' | 'socratic' | 'creative';
  welcome_message: string | null;
  guardrails: Record<string, any>;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AssistantKnowledge {
  id: string;
  assistant_id: string;
  content_type: 'file' | 'text' | 'url';
  title: string;
  content: string;
  source_info: Record<string, any>;
  created_at: string;
}

// Database response types (what we get from Supabase)
export interface AssistantKnowledgeFromDB {
  id: string;
  assistant_id: string;
  content_type: string; // This comes as a generic string from the database
  title: string;
  content: string;
  source_info: Record<string, any> | null;
  created_at: string;
}

export interface StudentConversation {
  id: string;
  assistant_id: string;
  student_session_id: string;
  message: string;
  response: string;
  sources: string[];
  feedback: number | null;
  created_at: string;
}

export interface CreateAssistantRequest {
  name: string;
  subject: string;
  personality: AIAssistant['personality'];
  welcome_message?: string;
  guardrails?: Record<string, any>;
}

export interface AddKnowledgeRequest {
  assistant_id: string;
  content_type: AssistantKnowledge['content_type'];
  title: string;
  content: string;
  source_info?: Record<string, any>;
}
