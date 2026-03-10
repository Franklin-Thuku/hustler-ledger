import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          phone: string | null
          role: 'owner' | 'assistant'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          phone?: string | null
          role?: 'owner' | 'assistant'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          phone?: string | null
          role?: 'owner' | 'assistant'
          updated_at?: string
        }
      }
      businesses: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          description: string | null
          location: string | null
          phone: string | null
          email: string | null
          registration_number: string | null
          tax_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: string
          description?: string | null
          location?: string | null
          phone?: string | null
          email?: string | null
          registration_number?: string | null
          tax_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: string
          description?: string | null
          location?: string | null
          phone?: string | null
          email?: string | null
          registration_number?: string | null
          tax_id?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          business_id: string
          type: 'sale' | 'expense' | 'credit' | 'repayment'
          amount: number
          category: string
          description: string
          customer_name: string | null
          customer_phone: string | null
          reference_number: string | null
          payment_method: string | null
          due_date: string | null
          status: 'pending' | 'completed' | 'overdue' | 'cancelled'
          metadata: Record<string, any> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          type: 'sale' | 'expense' | 'credit' | 'repayment'
          amount: number
          category: string
          description: string
          customer_name?: string | null
          customer_phone?: string | null
          reference_number?: string | null
          payment_method?: string | null
          due_date?: string | null
          status?: 'pending' | 'completed' | 'overdue' | 'cancelled'
          metadata?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          type?: 'sale' | 'expense' | 'credit' | 'repayment'
          amount?: number
          category?: string
          description?: string
          customer_name?: string | null
          customer_phone?: string | null
          reference_number?: string | null
          payment_method?: string | null
          due_date?: string | null
          status?: 'pending' | 'completed' | 'overdue' | 'cancelled'
          metadata?: Record<string, any> | null
          updated_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          business_id: string
          category: string
          limit_amount: number
          spent_amount: number
          period: 'monthly' | 'weekly' | 'yearly'
          start_date: string
          end_date: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          category: string
          limit_amount: number
          spent_amount?: number
          period: 'monthly' | 'weekly' | 'yearly'
          start_date: string
          end_date: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          category?: string
          limit_amount?: number
          spent_amount?: number
          period?: 'monthly' | 'weekly' | 'yearly'
          start_date?: string
          end_date?: string
          is_active?: boolean
          updated_at?: string
        }
      }
      savings_goals: {
        Row: {
          id: string
          business_id: string
          name: string
          target_amount: number
          current_amount: number
          target_date: string
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          target_amount: number
          current_amount?: number
          target_date: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          target_amount?: number
          current_amount?: number
          target_date?: string
          description?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          business_id: string | null
          type: 'info' | 'success' | 'warning' | 'error'
          title: string
          message: string
          is_read: boolean
          action_url: string | null
          metadata: Record<string, any> | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_id?: string | null
          type: 'info' | 'success' | 'warning' | 'error'
          title: string
          message: string
          is_read?: boolean
          action_url?: string | null
          metadata?: Record<string, any> | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_id?: string | null
          type?: 'info' | 'success' | 'warning' | 'error'
          title?: string
          message?: string
          is_read?: boolean
          action_url?: string | null
          metadata?: Record<string, any> | null
          expires_at?: string | null
        }
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

export type Transaction = Database['public']['Tables']['transactions']['Row']
export type Business = Database['public']['Tables']['businesses']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Budget = Database['public']['Tables']['budgets']['Row']
export type SavingsGoal = Database['public']['Tables']['savings_goals']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
