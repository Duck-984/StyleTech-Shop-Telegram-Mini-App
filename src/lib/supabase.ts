import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: { ru: string; uz: string };
          slug: string;
          icon: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          name: { ru: string; uz: string };
          slug: string;
          price: number;
          description: { ru: string; uz: string };
          category_id: string | null;
          subcategory: string | null;
          images: string[];
          sizes: string[];
          colors: Array<{ name: string; hex: string }>;
          specs: Record<string, any>;
          stock: number;
          is_active: boolean;
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at' | 'views'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      users: {
        Row: {
          id: string;
          telegram_id: number;
          first_name: string;
          username: string | null;
          language: string;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          telegram_user_id: number;
          items: any[];
          total_amount: number;
          status: string;
          customer_info: Record<string, any>;
          delivery_type: string;
          delivery_cost: number;
          payment_method: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
    };
  };
};
