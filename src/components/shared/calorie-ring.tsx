'use client'

import { cn } from '@/lib/utils'

interface CalorieRingProps {
  consumed: number
  target: number
  size?: number
  strokeWidth?: number
  label?: string
  unit?: string
  color?: string
}

export function CalorieRing({
  consumed,
  target,
  size = 120,
  strokeWidth = 10,
  label,
  unit = 'kcal',
  color,
}: CalorieRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const percent = Math.min((consumed / target) * 100, 100)
  const offset = circumference - (percent / 100) * circumference

  const getColor = () => {
    if (color) return color
    if (consumed > target * 1.1) return 'var(--destructive)'
    if (consumed > target * 0.9) return 'var(--warning)'
    return 'var(--primary)'
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-xl font-bold">{consumed}</span>
        <span className="text-xs text-muted-foreground">
          / {target} {unit}
        </span>
      </div>
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  )
}

export function CalorieRingWrapper(props: CalorieRingProps) {
  return (
    <div className="relative">
      <CalorieRing {...props} />
    </div>
  )
}
