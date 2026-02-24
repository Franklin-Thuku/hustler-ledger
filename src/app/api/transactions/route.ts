import { NextRequest, NextResponse } from 'next/server'
import { createTransaction, getTransactions, requireBusiness } from '@/lib/auth-simple'

export async function GET(request: NextRequest) {
  try {
    const { user, business } = await requireBusiness()
    const { searchParams } = new URL(request.url)
    
    const limit = parseInt(searchParams.get('limit') || '50')
    const transactions = await getTransactions(business.id, limit)
    
    return NextResponse.json(
      { success: true, data: transactions },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transactions' },
      { status: 400 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, business } = await requireBusiness()
    
    const transactionData = await request.json()
    
    const transaction = {
      business_id: business.id,
      ...transactionData
    }

    const data = await createTransaction(transaction)
    
    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Transaction creation failed' },
      { status: 400 }
    )
  }
}
