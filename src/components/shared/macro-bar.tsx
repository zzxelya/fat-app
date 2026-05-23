'use client'

import { cn } from '@/lib/utils'

interface MacroBarProps {
  protein: { current: number; target: number }
  fat: { current: number; target: number }
  carbs: { current: number; target: number }
}

export function MacroBar({ protein, fat, carbs }: MacroBarProps) {
  const items = [
    { label: '蛋白质', current: protein.current, target: protein.target, unit: 'g', color: 'bg-[var(--protein)]' },
    { label: '脂肪', current: fat.current, target: fat.target, unit: 'g', color: 'bg-[var(--fat)]' },
    { label: '碳水', current: carbs.current, target: carbs.target, unit: 'g', color: 'bg-[var(--carbs)]' },
  ]

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const percent = Math.min((item.current / item.target) * 100, 100)
        return (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">{item.label}</span>
              <span className="text-muted-foreground">
                {item.current}{item.unit} / {item.target}{item.unit}
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-500', item.color)}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
