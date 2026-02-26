import { supabase } from './auth-simple'
import { isDevMode, mockUser, mockBusiness, mockTransactions, mockDebts, mockBudgets, mockNotifications } from './dev-mode'

// --- INTERFACES ---

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  timestamp: string; // Required for Dashboard filters
  category: string;
  business_id: string;
  type: 'sale' | 'expense' | 'credit' | 'repayment'; 
  created_at: string;
}

export interface Debt {
  id: string;
  amount: number;
  creditor: string;
  customer: string;    // Dashboard requirement
  due_date: string;
  dueDate: string;     // Dashboard requirement
  daysOverdue: number; // Dashboard requirement
  status: 'pending' | 'paid';
}

// --- AUTH FUNCTIONS ---

export async function getCurrentUser() {
  if (isDevMode) return mockUser as any;
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    return user
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

export async function signUp(email: string, password: string, fullName: string, phone?: string) {
  if (isDevMode) return { user: mockUser, session: mockUser };
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone: phone } }
    })
    if (error) throw error
    return data
  } catch (error: any) {
    throw error
  }
}

export async function signIn(email: string, password: string) {
  if (isDevMode) return { user: mockUser, session: mockUser };
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  } catch (error: any) {
    throw error
  }
}

// --- BUSINESS & DATA FUNCTIONS ---

export async function getUserBusinesses(userId: string) {
  // If we are in Dev Mode, we mock the "New User" experience by returning []
  // Change this to [mockBusiness] if you want to skip registration during dev
  if (isDevMode) return []; 
  
  try {
    const { data } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
    return data || []
  } catch (error) {
    return []
  }
}

export async function getActiveBusiness(userId: string) {
  if (isDevMode) return mockBusiness;
  
  try {
    const { data } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .limit(1)
      .single()
    return data
  } catch (error) {
    return null
  }
}

export async function createBusiness(business: Record<string, any>) {
  if (isDevMode) return mockBusiness;
  
  try {
    const { data, error } = await supabase
      .from('businesses')
      .insert([business])
      .select()
      .single()
    if (error) throw error
    return data
  } catch (error: any) {
    console.error('Business creation error:', error)
    throw error
  }
}

export async function getTransactions(businessId: string, limit = 50): Promise<Transaction[]> {
  if (isDevMode) {
    return (mockTransactions as any[]).map(t => ({
      ...t,
      timestamp: t.timestamp || t.created_at
    })) as Transaction[];
  }
  
  try {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(limit)

    return (data || []).map((t: any) => ({
      ...t,
      timestamp: t.timestamp || t.created_at
    })) as Transaction[];
  } catch (error) {
    return []
  }
}

// --- MOCK HELPERS ---

export async function getMockDebts(): Promise<Debt[]> {
  if (isDevMode) {
    return (mockDebts as any[]).map(d => ({
      ...d,
      customer: d.customer || d.creditor,
      dueDate: d.dueDate || d.due_date,
      daysOverdue: d.daysOverdue || 0
    })) as Debt[];
  }
  return []
}

export async function getMockBudgets(): Promise<any[]> {
  return isDevMode ? mockBudgets : [];
}

export async function getMockNotifications(): Promise<any[]> {
  return isDevMode ? mockNotifications : [];
}

// --- MIDDLEWARE HELPERS ---

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Authentication required')
  return user
}

export async function requireBusiness() {
  const user = await requireAuth()
  if (isDevMode) return { user, business: mockBusiness };
  
  const business = await getActiveBusiness(user.id)
  if (!business) throw new Error('Business registration required')
  return { user, business }
}