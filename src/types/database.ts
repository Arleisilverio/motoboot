/**
 * Database Types
 * 
 * Placeholder for Supabase-generated database types.
 * 
 * To generate these types automatically, run:
 *   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
 * 
 * Or use the Supabase MCP tool:
 *   generate_typescript_types({ project_id: 'YOUR_PROJECT_ID' })
 */

export interface Database {
  public: {
    Tables: {
      deliveries: {
        Row: {
          id: string;
          order_number: string;
          status: string;
          pickup_address: string;
          delivery_address: string;
          customer_name: string;
          customer_phone: string | null;
          estimated_time: number | null;
          actual_time: number | null;
          distance: number | null;
          fee: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
          rider_id: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          status?: string;
          pickup_address: string;
          delivery_address: string;
          customer_name: string;
          customer_phone?: string | null;
          estimated_time?: number | null;
          fee: number;
          notes?: string | null;
          rider_id: string;
        };
        Update: {
          status?: string;
          actual_time?: number | null;
          completed_at?: string | null;
          notes?: string | null;
        };
      };
      riders: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          avatar_url: string | null;
          vehicle_plate: string;
          vehicle_model: string;
          is_online: boolean;
          rating: number;
          total_deliveries: number;
          created_at: string;
        };
        Insert: {
          name: string;
          email: string;
          phone: string;
          vehicle_plate: string;
          vehicle_model: string;
        };
        Update: {
          name?: string;
          phone?: string;
          avatar_url?: string | null;
          vehicle_plate?: string;
          vehicle_model?: string;
          is_online?: boolean;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      delivery_status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
    };
  };
}
