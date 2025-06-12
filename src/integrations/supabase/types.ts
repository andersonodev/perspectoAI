export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_assistants: {
        Row: {
          created_at: string
          guardrails: Json | null
          id: string
          is_published: boolean | null
          name: string
          personality: string
          subject: string
          updated_at: string
          user_id: string
          welcome_message: string | null
        }
        Insert: {
          created_at?: string
          guardrails?: Json | null
          id?: string
          is_published?: boolean | null
          name: string
          personality?: string
          subject: string
          updated_at?: string
          user_id: string
          welcome_message?: string | null
        }
        Update: {
          created_at?: string
          guardrails?: Json | null
          id?: string
          is_published?: boolean | null
          name?: string
          personality?: string
          subject?: string
          updated_at?: string
          user_id?: string
          welcome_message?: string | null
        }
        Relationships: []
      }
      assistant_analytics: {
        Row: {
          assistant_id: string | null
          created_at: string
          id: string
          messages_count: number
          session_duration_minutes: number | null
          session_id: string
        }
        Insert: {
          assistant_id?: string | null
          created_at?: string
          id?: string
          messages_count?: number
          session_duration_minutes?: number | null
          session_id: string
        }
        Update: {
          assistant_id?: string | null
          created_at?: string
          id?: string
          messages_count?: number
          session_duration_minutes?: number | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assistant_analytics_assistant_id_fkey"
            columns: ["assistant_id"]
            isOneToOne: false
            referencedRelation: "ai_assistants"
            referencedColumns: ["id"]
          },
        ]
      }
      assistant_knowledge: {
        Row: {
          assistant_id: string
          content: string
          content_type: string
          created_at: string
          id: string
          source_info: Json | null
          title: string
        }
        Insert: {
          assistant_id: string
          content: string
          content_type: string
          created_at?: string
          id?: string
          source_info?: Json | null
          title: string
        }
        Update: {
          assistant_id?: string
          content?: string
          content_type?: string
          created_at?: string
          id?: string
          source_info?: Json | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "assistant_knowledge_assistant_id_fkey"
            columns: ["assistant_id"]
            isOneToOne: false
            referencedRelation: "ai_assistants"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_sessions: {
        Row: {
          assistant_id: string | null
          created_at: string
          id: string
          messages: Json
          session_id: string
          updated_at: string
        }
        Insert: {
          assistant_id?: string | null
          created_at?: string
          id?: string
          messages?: Json
          session_id: string
          updated_at?: string
        }
        Update: {
          assistant_id?: string | null
          created_at?: string
          id?: string
          messages?: Json
          session_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_sessions_assistant_id_fkey"
            columns: ["assistant_id"]
            isOneToOne: false
            referencedRelation: "ai_assistants"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_gaps: {
        Row: {
          assistant_id: string | null
          first_asked: string
          frequency: number
          id: string
          last_asked: string
          question: string
        }
        Insert: {
          assistant_id?: string | null
          first_asked?: string
          frequency?: number
          id?: string
          last_asked?: string
          question: string
        }
        Update: {
          assistant_id?: string | null
          first_asked?: string
          frequency?: number
          id?: string
          last_asked?: string
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_gaps_assistant_id_fkey"
            columns: ["assistant_id"]
            isOneToOne: false
            referencedRelation: "ai_assistants"
            referencedColumns: ["id"]
          },
        ]
      }
      message_feedback: {
        Row: {
          assistant_id: string | null
          created_at: string
          feedback: number
          id: string
          message_index: number
          session_id: string
        }
        Insert: {
          assistant_id?: string | null
          created_at?: string
          feedback: number
          id?: string
          message_index: number
          session_id: string
        }
        Update: {
          assistant_id?: string | null
          created_at?: string
          feedback?: number
          id?: string
          message_index?: number
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_feedback_assistant_id_fkey"
            columns: ["assistant_id"]
            isOneToOne: false
            referencedRelation: "ai_assistants"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_knowledge: {
        Row: {
          assistant_id: string | null
          content: string
          created_at: string | null
          id: string
          session_id: string
          source: string
          tags: string[] | null
          title: string
          type: string
        }
        Insert: {
          assistant_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          session_id: string
          source: string
          tags?: string[] | null
          title: string
          type: string
        }
        Update: {
          assistant_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          session_id?: string
          source?: string
          tags?: string[] | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "personal_knowledge_assistant_id_fkey"
            columns: ["assistant_id"]
            isOneToOne: false
            referencedRelation: "ai_assistants"
            referencedColumns: ["id"]
          },
        ]
      }
      spaced_repetition_items: {
        Row: {
          assistant_id: string | null
          created_at: string | null
          difficulty: string | null
          id: string
          last_reviewed: string | null
          next_review: string
          session_id: string
          streak: number | null
          topic: string
        }
        Insert: {
          assistant_id?: string | null
          created_at?: string | null
          difficulty?: string | null
          id?: string
          last_reviewed?: string | null
          next_review: string
          session_id: string
          streak?: number | null
          topic: string
        }
        Update: {
          assistant_id?: string | null
          created_at?: string | null
          difficulty?: string | null
          id?: string
          last_reviewed?: string | null
          next_review?: string
          session_id?: string
          streak?: number | null
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "spaced_repetition_items_assistant_id_fkey"
            columns: ["assistant_id"]
            isOneToOne: false
            referencedRelation: "ai_assistants"
            referencedColumns: ["id"]
          },
        ]
      }
      student_conversations: {
        Row: {
          assistant_id: string
          created_at: string
          feedback: number | null
          id: string
          message: string
          response: string
          sources: Json | null
          student_session_id: string
        }
        Insert: {
          assistant_id: string
          created_at?: string
          feedback?: number | null
          id?: string
          message: string
          response: string
          sources?: Json | null
          student_session_id: string
        }
        Update: {
          assistant_id?: string
          created_at?: string
          feedback?: number | null
          id?: string
          message?: string
          response?: string
          sources?: Json | null
          student_session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_conversations_assistant_id_fkey"
            columns: ["assistant_id"]
            isOneToOne: false
            referencedRelation: "ai_assistants"
            referencedColumns: ["id"]
          },
        ]
      }
      study_plans: {
        Row: {
          assistant_id: string | null
          chapters: string[]
          completed_hours: number | null
          created_at: string | null
          exam_date: string
          id: string
          session_id: string
          subject: string
          tasks: Json
          total_estimated_hours: number | null
        }
        Insert: {
          assistant_id?: string | null
          chapters: string[]
          completed_hours?: number | null
          created_at?: string | null
          exam_date: string
          id?: string
          session_id: string
          subject: string
          tasks?: Json
          total_estimated_hours?: number | null
        }
        Update: {
          assistant_id?: string | null
          chapters?: string[]
          completed_hours?: number | null
          created_at?: string | null
          exam_date?: string
          id?: string
          session_id?: string
          subject?: string
          tasks?: Json
          total_estimated_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "study_plans_assistant_id_fkey"
            columns: ["assistant_id"]
            isOneToOne: false
            referencedRelation: "ai_assistants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
