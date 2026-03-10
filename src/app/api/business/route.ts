import { NextRequest, NextResponse } from 'next/server'
import { createBusiness, requireAuth } from '@/lib/auth-simple'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    const businessData = await request.json()
    
    const business = {
      user_id: user.id,
      ...businessData
    }

    const data = await createBusiness(business)
    
    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Business creation failed' },
      { status: 400 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    
    // This would fetch businesses for the authenticated user
    return NextResponse.json(
      { success: true, businesses: [] },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch businesses' },
      { status: 400 }
    )
  }
}
