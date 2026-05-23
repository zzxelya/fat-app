'use server'

import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'crypto'

const COOKIE_NAME = 'fat_session'
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 // 30 days

function getSecret(): string {
  const secret = process.env.COOKIE_SECRET
  if (!secret || secret.length < 16) {
    throw new Error('COOKIE_SECRET must be at least 16 characters')
  }
  return secret
}

function sign(payload: object, secret: string): string {
  const data = JSON.stringify(payload)
  const hmac = createHmac('sha256', secret)
  hmac.update(data)
  const sig = hmac.digest('hex')
  return Buffer.from(`${sig}.${data}`).toString('base64url')
}

function verify(token: string, secret: string): { authenticated: boolean; exp: number } | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString()
    const dotIndex = decoded.indexOf('.')
    if (dotIndex === -1) return null
    const sig = decoded.slice(0, dotIndex)
    const data = decoded.slice(dotIndex + 1)
    const hmac = createHmac('sha256', secret)
    hmac.update(data)
    const expectedSig = hmac.digest('hex')
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null
    return JSON.parse(data)
  } catch {
    return null
  }
}

export async function login(formData: FormData) {
  const password = formData.get('password') as string
  const appPassword = process.env.APP_PASSWORD
  if (!appPassword) throw new Error('APP_PASSWORD not configured')
  if (password === appPassword) {
    const secret = getSecret()
    const token = sign(
      { authenticated: true, exp: Date.now() + COOKIE_MAX_AGE * 1000 },
      secret
    )
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    })
    return { success: true }
  }
  return { success: false, error: '密码错误' }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return false
  const payload = verify(token, getSecret())
  if (!payload) return false
  return payload.authenticated === true && payload.exp > Date.now()
}
