import { isDevMode, mockUser, mockBusiness, mockTransactions, mockDebts, mockBudgets, mockNotifications } from './dev-mode'
import { supabase } from './auth-simple'

// Authentication helper functions with dev mode fallback
export async function getCurrentUser() {
  if (isDevMode) {
    return mockUser
  }

  try {
    const {
      data: { user },
      error
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

export async function getCurrentProfile() {
  if (isDevMode) {
    return {
      id: mockUser.id,
      username: 'mamboga',
      full_name: mockUser.user_metadata.full_name,
      avatar_url: null,
      website: null,
      phone: mockUser.user_metadata.phone,
      role: 'owner' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  try {
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
  } catch (error) {
    console.error('Profile fetch error:', error)
    return null
  }
}

export async function getUserBusinesses(userId: string) {
  if (isDevMode) {
    return [mockBusiness]
  }

  try {
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
  } catch (error) {
    console.error('Businesses fetch error:', error)
    return []
  }
}

export async function getActiveBusiness(userId: string) {
  if (isDevMode) {
    return mockBusiness
  }

  try {
    const { data: business, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching active business:', error)
    }

    return business
  } catch (error) {
    console.error('Active business fetch error:', error)
    return null
  }
}

// Sign up with profile creation
export async function signUp(email: string, password: string, fullName: string, phone?: string) {
  if (isDevMode) {
    console.log('Dev mode: Mock signup', { email, fullName, phone })
    return { user: mockUser, session: { user: mockUser } }
  }

  try {
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
  } catch (error: any) {
    console.error('Signup error:', error)
    throw error
  }
}

// Sign in
export async function signIn(email: string, password: string) {
  if (isDevMode) {
    console.log('Dev mode: Mock login', { email })
    return { user: mockUser, session: { user: mockUser } }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      throw error
    }

    return data
  } catch (error: any) {
    console.error('Login error:', error)
    throw error
  }
}

// Sign out
export async function signOut() {
  if (isDevMode) {
    console.log('Dev mode: Mock logout')
    return
  }

  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      throw error
    }
  } catch (error: any) {
    console.error('Logout error:', error)
    throw error
  }
}

// Transaction functions
export async function getTransactions(businessId: string, limit = 50) {
  if (isDevMode) {
    return mockTransactions.slice(0, limit)
  }

  try {
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
  } catch (error) {
    console.error('Transactions fetch error:', error)
    return []
  }
}

export async function createTransaction(transaction: Record<string, any>) {
  if (isDevMode) {
    console.log('Dev mode: Mock transaction creation', transaction)
    return {
      id: Date.now().toString(),
      ...transaction,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error: any) {
    console.error('Transaction creation error:', error)
    throw error
  }
}

// Business functions
export async function createBusiness(business: Record<string, any>) {
  if (isDevMode) {
    console.log('Dev mode: Mock business creation', business)
    return mockBusiness
  }

  try {
    const { data, error } = await supabase
      .from('businesses')
      .insert([business])
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error: any) {
    console.error('Business creation error:', error)
    throw error
  }
}

// Mock data getters for dashboard
export function getMockDebts() {
  return mockDebts
}

export function getMockBudgets() {
  return mockBudgets
}

export function getMockNotifications() {
  return mockNotifications
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
