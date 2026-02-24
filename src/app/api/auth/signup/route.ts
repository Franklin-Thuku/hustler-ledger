import { NextRequest, NextResponse } from 'next/server'
import { signUp } from '@/lib/auth-simple'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, phone } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      )
    }

    const data = await signUp(email, password, fullName, phone)
    
    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Signup failed' },
      { status: 400 }
    )
  }
}
