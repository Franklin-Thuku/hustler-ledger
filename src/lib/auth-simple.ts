import { createClient } from '@supabase/supabase-js'

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Authentication helper functions
export async function getCurrentUser() {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

export async function getCurrentProfile() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return profile
}

export async function getUserBusinesses(userId: string) {
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching businesses:', error)
    return []
  }

  return businesses || []
}

export async function getActiveBusiness(userId: string) {
  const { data: business, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
    console.error('Error fetching active business:', error)
  }

  return business
}

// Sign up with profile creation
export async function signUp(email: string, password: string, fullName: string, phone?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone
      }
    }
  })

  if (error) {
    throw error
  }

  return data
}

// Sign in
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    throw error
  }

  return data
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw error
  }
}

// Reset password
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password`
  })

  if (error) {
    throw error
  }
}

// Update profile
export async function updateProfile(userId: string, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// Transaction functions
export async function getTransactions(businessId: string, limit = 50) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching transactions:', error)
    return []
  }

  return data || []
}

export async function createTransaction(transaction: Record<string, any>) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction])
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// Business functions
export async function createBusiness(business: Record<string, any>) {
  const { data, error } = await supabase
    .from('businesses')
    .insert([business])
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// Middleware for protected routes
export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
}

export async function requireBusiness() {
  const user = await requireAuth()
  const business = await getActiveBusiness(user.id)
  
  if (!business) {
    throw new Error('Business registration required')
  }
  
  return { user, business }
}
