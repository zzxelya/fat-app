'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Leaf } from 'lucide-react'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('password', password)
      const res = await fetch('/api/auth/login', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        router.push('/')
        router.refresh()
      } else {
        setError(data.error || '密码错误')
      }
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Leaf className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">减脂记录</h1>
          <p className="text-muted-foreground text-sm mt-1">输入密码以访问</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 text-center text-lg"
              autoFocus
            />
          </div>
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={loading || !password}
          >
            {loading ? '验证中...' : '进入'}
          </Button>
        </form>
      </div>
    </div>
  )
}
