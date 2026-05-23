'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PlusCircle, BarChart3, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import {
  ClipboardList,
  History,
  Target,
  UtensilsCrossed,
} from 'lucide-react'

const mainNavItems = [
  { href: '/', label: '今日', icon: Home },
  { href: '/log', label: '记录', icon: PlusCircle },
  { href: '/stats', label: '图表', icon: BarChart3 },
]

const moreNavItems = [
  { href: '/history', label: '历史记录', icon: History },
  { href: '/phases', label: '阶段目标', icon: Target },
  { href: '/checklist', label: '每日清单', icon: ClipboardList },
  { href: '/cheat-meal', label: '欺骗餐', icon: UtensilsCrossed },
]

export function BottomNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/80 backdrop-blur-md md:hidden">
      <div className="max-w-2xl mx-auto flex items-center justify-around h-16">
        {mainNavItems.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className={cn(
              'flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors',
              moreNavItems.some((item) => pathname.startsWith(item.href))
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-medium">更多</span>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl">
            <div className="py-4 space-y-1">
              <h3 className="px-4 text-sm font-semibold text-muted-foreground mb-3">更多功能</h3>
              {moreNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    pathname.startsWith(item.href)
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
