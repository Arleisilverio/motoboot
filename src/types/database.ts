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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_active: boolean
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_active?: boolean
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_active?: boolean
          updated_at?: string | null
        }
        Relationships: []
      }
      apartments: {
        Row: {
          amount_paid: number | null
          monthly_rent: number | null
          next_due_date: string | null
          number: number
          payment_request_pending: boolean | null
          remaining_balance: number | null
          rent_status: string | null
          status: string | null
          tenant_id: string | null
        }
        Insert: {
          amount_paid?: number | null
          monthly_rent?: number | null
          next_due_date?: string | null
          number: number
          payment_request_pending?: boolean | null
          remaining_balance?: number | null
          rent_status?: string | null
          status?: string | null
          tenant_id?: string | null
        }
        Update: {
          amount_paid?: number | null
          monthly_rent?: number | null
          next_due_date?: string | null
          number?: number
          payment_request_pending?: boolean | null
          remaining_balance?: number | null
          rent_status?: string | null
          status?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "apartments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      app_logs: {
        Row: {
          created_at: string | null
          details: Json | null
          id: string
          level: string
          message: string
          source: string
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: string
          level: string
          message: string
          source: string
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: string
          level?: string
          message?: string
          source?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booked_by: string
          court_id: number
          created_at: string | null
          game_type: string
          id: string
          needs_players: boolean | null
          players: Json
          start_time: string
        }
        Insert: {
          booked_by: string
          court_id: number
          created_at?: string | null
          game_type: string
          id?: string
          needs_players?: boolean | null
          players: Json
          start_time: string
        }
        Update: {
          booked_by?: string
          court_id?: number
          created_at?: string | null
          game_type?: string
          id?: string
          needs_players?: boolean | null
          players?: Json
          start_time?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          contact: string | null
          created_at: string | null
          default_rate: number | null
          id: string
          name: string
          notes: string | null
          user_id: string | null
        }
        Insert: {
          contact?: string | null
          created_at?: string | null
          default_rate?: number | null
          id?: string
          name: string
          notes?: string | null
          user_id?: string | null
        }
        Update: {
          contact?: string | null
          created_at?: string | null
          default_rate?: number | null
          id?: string
          name?: string
          notes?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      collaborators: {
        Row: {
          created_at: string | null
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      complaints: {
        Row: {
          apartment_number: number | null
          attachments: string[] | null
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          status: string | null
          tenant_id: string
        }
        Insert: {
          apartment_number?: number | null
          attachments?: string[] | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          tenant_id: string
        }
        Update: {
          apartment_number?: number | null
          attachments?: string[] | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaints_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      images: {
        Row: {
          alt: string | null
          created_at: string | null
          description: string | null
          id: string
          src: string
          title: string | null
        }
        Insert: {
          alt?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          src: string
          title?: string | null
        }
        Update: {
          alt?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          src?: string
          title?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          dismissible: boolean | null
          icon: string | null
          id: string
          message: string | null
          read: boolean | null
          tenant_id: string
          title: string | null
        }
        Insert: {
          created_at?: string | null
          dismissible?: boolean | null
          icon?: string | null
          id?: string
          message?: string | null
          read?: boolean | null
          tenant_id: string
          title?: string | null
        }
        Update: {
          created_at?: string | null
          dismissible?: boolean | null
          icon?: string | null
          id?: string
          message?: string | null
          read?: boolean | null
          tenant_id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_requests: {
        Row: {
          apartment_number: number | null
          created_at: string | null
          id: string
          status: string | null
          tenant_id: string
        }
        Insert: {
          apartment_number?: number | null
          created_at?: string | null
          id?: string
          status?: string | null
          tenant_id: string
        }
        Update: {
          apartment_number?: number | null
          created_at?: string | null
          id?: string
          status?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_requests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          apartment_number: number | null
          avatar_url: string | null
          email: string | null
          full_name: string | null
          helmet_color: string | null
          id: string
          move_in_date: string | null
          name: string | null
          phone: string | null
          role: string
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          apartment_number?: number | null
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          helmet_color?: string | null
          id: string
          move_in_date?: string | null
          name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          apartment_number?: number | null
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          helmet_color?: string | null
          id?: string
          move_in_date?: string | null
          name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          address: string | null
          client_id: string | null
          client_name: string | null
          collaborator_id: string | null
          collaborator_name: string | null
          date: string | null
          delivery_notes: string | null
          id: string
          neighborhood: string | null
          notes: string | null
          recipient: string | null
          type: string | null
          user_id: string | null
          value: number | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          client_id?: string | null
          client_name?: string | null
          collaborator_id?: string | null
          collaborator_name?: string | null
          date?: string | null
          delivery_notes?: string | null
          id?: string
          neighborhood?: string | null
          notes?: string | null
          recipient?: string | null
          type?: string | null
          user_id?: string | null
          value?: number | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          client_id?: string | null
          client_name?: string | null
          collaborator_id?: string | null
          collaborator_name?: string | null
          date?: string | null
          delivery_notes?: string | null
          id?: string
          neighborhood?: string | null
          notes?: string | null
          recipient?: string | null
          type?: string | null
          user_id?: string | null
          value?: number | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_collaborator_id_fkey"
            columns: ["collaborator_id"]
            isOneToOne: false
            referencedRelation: "collaborators"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          category: string | null
          created_at: string | null
          description: string
          id: string
          receipt_url: string | null
          transaction_date: string
          type: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string | null
          description: string
          id?: string
          receipt_url?: string | null
          transaction_date: string
          type: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string | null
          description?: string
          id?: string
          receipt_url?: string | null
          transaction_date?: string
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_old_bookings: { Args: never; Returns: undefined }
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
