// Development mode mock data for testing without Supabase
export const isDevMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NODE_ENV === 'development'

// Mock user data
export const mockUser = {
  id: 'mock-user-id',
  email: 'test@hustler-ledger.com',
  user_metadata: {
    full_name: 'Test User',
    phone: '+254700000000'
  }
}

// Mock business data
export const mockBusiness = {
  id: 'mock-business-id',
  user_id: 'mock-user-id',
  name: 'Mama Mboga Kiosk',
  type: 'Retail Shop',
  description: 'Fresh vegetables and fruits',
  location: 'Nairobi, Kenya',
  phone: '+254700000000',
  email: 'mamboga@hustler-ledger.com',
  registration_number: 'BN-2024-12345',
  tax_id: 'TX-2024-67890',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

// Mock transactions
export const mockTransactions = [
  {
    id: '1',
    business_id: 'mock-business-id',
    type: 'sale' as const,
    amount: 2500,
    category: 'Vegetables',
    description: 'Tomatoes and onions',
    customer_name: 'John Doe',
    customer_phone: '+254711111111',
    reference_number: 'TXN-001',
    payment_method: 'Cash',
    due_date: null,
    status: 'completed' as const,
    metadata: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    business_id: 'mock-business-id',
    type: 'expense' as const,
    amount: 800,
    category: 'Transport',
    description: 'Market transport',
    customer_name: null,
    customer_phone: null,
    reference_number: 'TXN-002',
    payment_method: 'Cash',
    due_date: null,
    status: 'completed' as const,
    metadata: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    business_id: 'mock-business-id',
    type: 'credit' as const,
    amount: 1500,
    category: 'Vegetables',
    description: 'Credit sale',
    customer_name: 'Jane Smith',
    customer_phone: '+254722222222',
    reference_number: 'TXN-003',
    payment_method: 'Credit',
    due_date: new Date(Date.now() + 7 * 86400000).toISOString(),
    status: 'pending' as const,
    metadata: null,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString()
  }
]

// Mock debts
export const mockDebts = [
  {
    id: '1',
    customer: 'Jane Smith',
    amount: 1500,
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
    daysOverdue: -5
  },
  {
    id: '2',
    customer: 'Mike Wilson',
    amount: 800,
    dueDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    daysOverdue: 10
  },
  {
    id: '3',
    customer: 'Sarah Davis',
    amount: 2200,
    dueDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    daysOverdue: 2
  }
]

// Mock budgets
export const mockBudgets = [
  {
    category: 'Transport',
    limit: 5000,
    spent: 3200
  },
  {
    category: 'Supplies',
    limit: 8000,
    spent: 6500
  },
  {
    category: 'Marketing',
    limit: 2000,
    spent: 800
  }
]

// Mock notifications
export const mockNotifications = [
  {
    id: '1',
    type: 'warning' as const,
    message: 'Low balance warning: Only KES 2,500 remaining',
    timestamp: new Date().toISOString(),
    read: false
  },
  {
    id: '2',
    type: 'error' as const,
    message: 'Jane Smith payment is 5 days overdue',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: false
  },
  {
    id: '3',
    type: 'success' as const,
    message: 'Daily sales target achieved!',
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    read: true
  }
]
