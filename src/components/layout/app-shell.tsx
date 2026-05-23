'use client'

import { AuthGuard } from '@/components/layout/auth-guard'
import { Header } from '@/components/layout/header'
import { BottomNav } from '@/components/layout/bottom-nav'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 pb-20 md:pb-4">
          {children}
        </main>
        <BottomNav />
      </div>
    </AuthGuard>
  )
}
