export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      ablation_results: {
        Row: {
          accuracy: number | null
          config_name: string
          config_type: string
          created_at: string
          id: string
          macro_f1: number | null
          macro_precision: number | null
          macro_recall: number | null
          notes: string | null
          user_id: string
        }
        Insert: {
          accuracy?: number | null
          config_name: string
          config_type?: string
          created_at?: string
          id?: string
          macro_f1?: number | null
          macro_precision?: number | null
          macro_recall?: number | null
          notes?: string | null
          user_id: string
        }
        Update: {
          accuracy?: number | null
          config_name?: string
          config_type?: string
          created_at?: string
          id?: string
          macro_f1?: number | null
          macro_precision?: number | null
          macro_recall?: number | null
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      architecture_candidates: {
        Row: {
          accuracy: number | null
          created_at: string
          description: string | null
          id: string
          macro_f1: number | null
          macro_precision: number | null
          macro_recall: number | null
          model_type: string | null
          name: string
          notes: string | null
          selected_for_fl: boolean
          selection_rationale: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accuracy?: number | null
          created_at?: string
          description?: string | null
          id?: string
          macro_f1?: number | null
          macro_precision?: number | null
          macro_recall?: number | null
          model_type?: string | null
          name: string
          notes?: string | null
          selected_for_fl?: boolean
          selection_rationale?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accuracy?: number | null
          created_at?: string
          description?: string | null
          id?: string
          macro_f1?: number | null
          macro_precision?: number | null
          macro_recall?: number | null
          model_type?: string | null
          name?: string
          notes?: string | null
          selected_for_fl?: boolean
          selection_rationale?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      client_partitions: {
        Row: {
          characteristics: string | null
          created_at: string
          id: string
          name: string
          notes: string | null
          org_type: string | null
          role_distribution: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          characteristics?: string | null
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          org_type?: string | null
          role_distribution?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          characteristics?: string | null
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          org_type?: string | null
          role_distribution?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      datasets: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          rationale: string | null
          source_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          rationale?: string | null
          source_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          rationale?: string | null
          source_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      feature_catalog: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          notes: string | null
          time_window: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          notes?: string | null
          time_window?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          notes?: string | null
          time_window?: string | null
          user_id?: string
        }
        Relationships: []
      }
      fl_experiments: {
        Row: {
          accuracy: number | null
          architecture: string | null
          auc_roc: number | null
          client_pairing: string
          created_at: string
          experiment_name: string
          id: string
          macro_f1: number | null
          macro_precision: number | null
          macro_recall: number | null
          mu_value: number | null
          notes: string | null
          training_paradigm: string
          updated_at: string
          user_id: string
        }
        Insert: {
          accuracy?: number | null
          architecture?: string | null
          auc_roc?: number | null
          client_pairing?: string
          created_at?: string
          experiment_name: string
          id?: string
          macro_f1?: number | null
          macro_precision?: number | null
          macro_recall?: number | null
          mu_value?: number | null
          notes?: string | null
          training_paradigm?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          accuracy?: number | null
          architecture?: string | null
          auc_roc?: number | null
          client_pairing?: string
          created_at?: string
          experiment_name?: string
          id?: string
          macro_f1?: number | null
          macro_precision?: number | null
          macro_recall?: number | null
          mu_value?: number | null
          notes?: string | null
          training_paradigm?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gap_statements: {
        Row: {
          checklist: Json | null
          content: string | null
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          checklist?: Json | null
          content?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          checklist?: Json | null
          content?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      jsd_measurements: {
        Row: {
          client_a: string
          client_b: string
          created_at: string
          id: string
          jsd_value: number | null
          notes: string | null
          user_id: string
        }
        Insert: {
          client_a: string
          client_b: string
          created_at?: string
          id?: string
          jsd_value?: number | null
          notes?: string | null
          user_id: string
        }
        Update: {
          client_a?: string
          client_b?: string
          created_at?: string
          id?: string
          jsd_value?: number | null
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      literature_papers: {
        Row: {
          authors: string | null
          circle: string
          created_at: string
          id: string
          key_takeaways: string | null
          relevance_notes: string | null
          source: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          year: number | null
        }
        Insert: {
          authors?: string | null
          circle?: string
          created_at?: string
          id?: string
          key_takeaways?: string | null
          relevance_notes?: string | null
          source?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          year?: number | null
        }
        Update: {
          authors?: string | null
          circle?: string
          created_at?: string
          id?: string
          key_takeaways?: string | null
          relevance_notes?: string | null
          source?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          year?: number | null
        }
        Relationships: []
      }
      phase_checklist_items: {
        Row: {
          checked: boolean
          created_at: string
          id: string
          label: string
          phase_number: number
          sort_order: number
          user_id: string
        }
        Insert: {
          checked?: boolean
          created_at?: string
          id?: string
          label: string
          phase_number: number
          sort_order?: number
          user_id: string
        }
        Update: {
          checked?: boolean
          created_at?: string
          id?: string
          label?: string
          phase_number?: number
          sort_order?: number
          user_id?: string
        }
        Relationships: []
      }
      phases: {
        Row: {
          completion_percentage: number
          created_at: string
          id: string
          notes: string | null
          phase_number: number
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completion_percentage?: number
          created_at?: string
          id?: string
          notes?: string | null
          phase_number: number
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completion_percentage?: number
          created_at?: string
          id?: string
          notes?: string | null
          phase_number?: number
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviewer_suggestions: {
        Row: {
          affiliation: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          relevant_papers: string | null
          user_id: string
        }
        Insert: {
          affiliation?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          relevant_papers?: string | null
          user_id: string
        }
        Update: {
          affiliation?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          relevant_papers?: string | null
          user_id?: string
        }
        Relationships: []
      }
      revision_log: {
        Row: {
          created_at: string
          id: string
          response: string | null
          reviewer_comment: string
          round_number: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          response?: string | null
          reviewer_comment?: string
          round_number?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          response?: string | null
          reviewer_comment?: string
          round_number?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stat_tests: {
        Row: {
          comparison: string
          confidence_interval: string | null
          created_at: string
          id: string
          notes: string | null
          p_value: number | null
          significant: boolean | null
          test_name: string
          test_statistic: number | null
          user_id: string
        }
        Insert: {
          comparison?: string
          confidence_interval?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          p_value?: number | null
          significant?: boolean | null
          test_name: string
          test_statistic?: number | null
          user_id: string
        }
        Update: {
          comparison?: string
          confidence_interval?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          p_value?: number | null
          significant?: boolean | null
          test_name?: string
          test_statistic?: number | null
          user_id?: string
        }
        Relationships: []
      }
      writing_sections: {
        Row: {
          created_at: string
          id: string
          key_points: Json | null
          notes: string | null
          section_name: string
          section_order: number
          status: string
          updated_at: string
          user_id: string
          word_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          key_points?: Json | null
          notes?: string | null
          section_name: string
          section_order?: number
          status?: string
          updated_at?: string
          user_id: string
          word_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          key_points?: Json | null
          notes?: string | null
          section_name?: string
          section_order?: number
          status?: string
          updated_at?: string
          user_id?: string
          word_count?: number
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
