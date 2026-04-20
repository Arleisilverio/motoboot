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
    }\n    Enums: {\n      [_ in never]: never\n    }\n    CompositeTypes: {\n      [_ in never]: never\n    }\n  }\n}\n\ntype DatabaseWithoutInternals = Omit<Database, \"__InternalSupabase\">\n\ntype DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, \"public\">]\n\nexport type Tables<\n  DefaultSchemaTableNameOrOptions extends\n    | keyof (DefaultSchema[\"Tables\"] & DefaultSchema[\"Views\"])\n    | { schema: keyof DatabaseWithoutInternals },\n  TableName extends DefaultSchemaTableNameOrOptions extends {\n    schema: keyof DatabaseWithoutInternals\n  }\n    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions[\"schema\"]][\"Tables\"] &\n        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions[\"schema\"]][\"Views\"])\n    : never = never,\n> = DefaultSchemaTableNameOrOptions extends {\n  schema: keyof DatabaseWithoutInternals\n}\n  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions[\"schema\"]][\"Tables\"] &\n      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions[\"schema\"]][\"Views\"])[TableName] extends {\n      Row: infer R\n    }\n    ? R\n    : never\n  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema[\"Tables\"] &\n        DefaultSchema[\"Views\"])\n    ? (DefaultSchema[\"Tables\"] &\n        DefaultSchema[\"Views\"])[DefaultSchemaTableNameOrOptions] extends {\n        Row: infer R\n      }\n      ? R\n      : never\n    : never\n\nexport type TablesInsert<\n  DefaultSchemaTableNameOrOptions extends\n    | keyof DefaultSchema[\"Tables\"]\n    | { schema: keyof DatabaseWithoutInternals },\n  TableName extends DefaultSchemaTableNameOrOptions extends {\n    schema: keyof DatabaseWithoutInternals\n  }\n    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions[\"schema\"]][\"Tables\"]\n    : never = never,\n> = DefaultSchemaTableNameOrOptions extends {\n  schema: keyof DatabaseWithoutInternals\n}\n  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions[\"schema\"]][\"Tables\"][TableName] extends {\n      Insert: infer I\n    }\n    ? I\n    : never\n  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema[\"Tables\"]\n    ? DefaultSchema[\"Tables\"][DefaultSchemaTableNameOrOptions] extends {\n        Insert: infer I\n      }\n      ? I\n      : never\n    : never\n\nexport type TablesUpdate<\n  DefaultSchemaTableNameOrOptions extends\n    | keyof DefaultSchema[\"Tables\"]\n    | { schema: keyof DatabaseWithoutInternals },\n  TableName extends DefaultSchemaTableNameOrOptions extends {\n    schema: keyof DatabaseWithoutInternals\n  }\n    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions[\"schema\"]][\"Tables\"]\n    : never = never,\n> = DefaultSchemaTableNameOrOptions extends {\n  schema: keyof DatabaseWithoutInternals\n}\n  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions[\"schema\"]][\"Tables\"][TableName] extends {\n      Update: infer U\n    }\n    ? U\n    : never\n  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema[\"Tables\"]\n    ? DefaultSchema[\"Tables\"][DefaultSchemaTableNameOrOptions] extends {\n        Update: infer U\n      }\n      ? U\n      : never\n    : never\n\nexport type Enums<\n  DefaultSchemaEnumNameOrOptions extends\n    | keyof DefaultSchema[\"Enums\"]\n    | { schema: keyof DatabaseWithoutInternals },\n  EnumName extends DefaultSchemaEnumNameOrOptions extends {\n    schema: keyof DatabaseWithoutInternals\n  }\n    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions[\"schema\"]][\"Enums\"]\n    : never = never,\n> = DefaultSchemaEnumNameOrOptions extends {\n  schema: keyof DatabaseWithoutInternals\n}\n  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions[\"schema\"]][\"Enums\"][EnumName]\n  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema[\"Enums\"]\n    ? DefaultSchema[\"Enums\"][DefaultSchemaEnumNameOrOptions]\n    : never\n\nexport type CompositeTypes<\n  PublicCompositeTypeNameOrOptions extends\n    | keyof DefaultSchema[\"CompositeTypes\"]\n    | { schema: keyof DatabaseWithoutInternals },\n  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {\n    schema: keyof DatabaseWithoutInternals\n  }\n    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions[\"schema\"]][\"CompositeTypes\"]\n    : never = never,\n> = PublicCompositeTypeNameOrOptions extends {\n  schema: keyof DatabaseWithoutInternals\n}\n  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions[\"schema\"]][\"CompositeTypes\"][CompositeTypeName]\n  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema[\"CompositeTypes\"]\n    ? DefaultSchema[\"CompositeTypes\"][PublicCompositeTypeNameOrOptions]\n    : never\n\nexport const Constants = {\n  public: {\n    Enums: {},\n  },\n} as const
