'use client'

import Link from 'next/link'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent } from '@/components/ui/card'
import {
  Scale,
  UtensilsCrossed,
  GlassWater,
  FlaskConical,
  Dumbbell,
  CupSoda,
  AlertTriangle,
  Pizza,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface LogButtonItem {
  href: string
  label: string
  description: string
  icon: LucideIcon
  color: string
}

const logButtons: LogButtonItem[] = [
  {
    href: '/log/weight',
    label: '体重',
    description: '记录今日体重',
    icon: Scale,
    color: 'text-[var(--primary)]',
  },
  {
    href: '/log/meals',
    label: '饮食',
    description: '记录每餐摄入',
    icon: UtensilsCrossed,
    color: 'text-[var(--carbs)]',
  },
  {
    href: '/log/water',
    label: '饮水',
    description: '记录饮水量',
    icon: GlassWater,
    color: 'text-[var(--water)]',
  },
  {
    href: '/log/protein',
    label: '蛋白粉',
    description: '记录蛋白粉摄入',
    icon: FlaskConical,
    color: 'text-[var(--protein)]',
  },
  {
    href: '/log/exercise',
    label: '运动',
    description: '记录运动消耗',
    icon: Dumbbell,
    color: 'text-[var(--exercise)]',
  },
  {
    href: '/log/beverage',
    label: '饮料',
    description: '记录饮料摄入',
    icon: CupSoda,
    color: 'text-[var(--fat)]',
  },
  {
    href: '/log/hunger',
    label: '饥饿事件',
    description: '记录饥饿感受',
    icon: AlertTriangle,
    color: 'text-[var(--warning)]',
  },
  {
    href: '/cheat-meal',
    label: '欺骗餐',
    description: '记录欺骗餐',
    icon: Pizza,
    color: 'text-[var(--destructive)]',
  },
]

export default function LogHubPage() {
  return (
    <AppShell>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold">记录</h1>
          <p className="text-sm text-muted-foreground mt-1">选择要记录的类型</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {logButtons.map((item) => (
            <Link key={item.href} href={item.href} className="block">
              <Card className="transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98] cursor-pointer h-full">
                <CardContent className="flex flex-col items-center justify-center py-6 gap-3 text-center">
                  <div className={`rounded-full bg-muted/60 p-3 ${item.color}`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{item.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
