import { NextResponse } from 'next/server'
import { login } from '@/lib/auth'

export async function POST(request: Request) {
  const formData = await request.formData()
  const result = await login(formData)
  if (result.success) {
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ success: false, error: result.error }, { status: 401 })
}
