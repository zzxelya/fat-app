'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/auth/check')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setAuthenticated(true)
        } else if (pathname !== '/login') {
          router.replace('/login')
        }
        setChecked(true)
      })
      .catch(() => {
        if (pathname !== '/login') {
          router.replace('/login')
        }
        setChecked(true)
      })
  }, [pathname, router])

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!authenticated && pathname !== '/login') {
    return null
  }

  return <>{children}</>
}
