'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isToday, addMonths, subMonths } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface HistoryViewProps {
  initialMonth: string
  initialData: {
    meals: { date: string; slot: string; calories: number }[]
    exercises: { date: string; type: string; duration_min: number }[]
    water: { date: string; ml: number }[]
    weight: { date: string; weight_kg: number }[]
  }
}

export function HistoryView({ initialMonth, initialData }: HistoryViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(initialMonth + '-01'))

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const startDay = getDay(monthStart)
  const adjustedStartDay = startDay === 0 ? 6 : startDay - 1

  const dataMap = new Map<string, { hasMeal: boolean; hasExercise: boolean; hasWater: boolean; weight?: number }>()
  initialData.meals.forEach((m) => {
    const existing = dataMap.get(m.date) || { hasMeal: false, hasExercise: false, hasWater: false }
    existing.hasMeal = true
    dataMap.set(m.date, existing)
  })
  initialData.exercises.forEach((e) => {
    const existing = dataMap.get(e.date) || { hasMeal: false, hasExercise: false, hasWater: false }
    existing.hasExercise = true
    dataMap.set(e.date, existing)
  })
  initialData.water.forEach((w) => {
    const existing = dataMap.get(w.date) || { hasMeal: false, hasExercise: false, hasWater: false }
    existing.hasWater = true
    dataMap.set(w.date, existing)
  })
  initialData.weight.forEach((w) => {
    const existing = dataMap.get(w.date) || { hasMeal: false, hasExercise: false, hasWater: false }
    existing.weight = w.weight_kg
    dataMap.set(w.date, existing)
  })

  const weekDays = ['一', '二', '三', '四', '五', '六', '日']

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">历史记录</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[100px] text-center">
            {format(currentDate, 'yyyy年M月', { locale: zhCN })}
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-xs text-muted-foreground font-medium py-1">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: adjustedStartDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {days.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd')
              const dayData = dataMap.get(dateStr)
              const today = isToday(day)

              return (
                <Link
                  key={dateStr}
                  href={`/?date=${dateStr}`}
                  className={`
                    relative flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-sm
                    transition-colors hover:bg-muted
                    ${today ? 'bg-primary/10 text-primary font-bold' : ''}
                  `}
                >
                  <span className="text-xs">{format(day, 'd')}</span>
                  {dayData && (
                    <div className="flex gap-0.5">
                      {dayData.hasMeal && <div className="w-1 h-1 rounded-full bg-primary" />}
                      {dayData.hasExercise && <div className="w-1 h-1 rounded-full bg-[var(--exercise)]" />}
                      {dayData.hasWater && <div className="w-1 h-1 rounded-full bg-[var(--water)]" />}
                    </div>
                  )}
                  {dayData?.weight && (
                    <span className="text-[8px] text-muted-foreground">{dayData.weight}</span>
                  )}
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span>饮食</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[var(--exercise)]" />
          <span>运动</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[var(--water)]" />
          <span>饮水</span>
        </div>
      </div>
    </div>
  )
}
