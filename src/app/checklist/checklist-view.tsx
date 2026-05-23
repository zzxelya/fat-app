'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { DAILY_CHECKLIST_ITEMS, WEEKLY_CHECKLIST_ITEMS } from '@/lib/constants'
import { toggleChecklistItem, toggleWeeklyChecklistItem } from '@/lib/actions'

interface ChecklistViewProps {
  date: string
  weekStart: string
  dailyItems: { item_key: string; completed: boolean }[]
  weeklyItems: { item_key: string; completed: boolean }[]
}

export function ChecklistView({ date, weekStart, dailyItems, weeklyItems }: ChecklistViewProps) {
  const [dailyState, setDailyState] = useState(() => {
    const map = new Map<string, boolean>()
    dailyItems.forEach((item) => map.set(item.item_key, item.completed))
    return map
  })

  const [weeklyState, setWeeklyState] = useState(() => {
    const map = new Map<string, boolean>()
    weeklyItems.forEach((item) => map.set(item.item_key, item.completed))
    return map
  })

  const completedDaily = Array.from(dailyState.values()).filter(Boolean).length
  const completedWeekly = Array.from(weeklyState.values()).filter(Boolean).length

  async function handleDailyToggle(key: string, checked: boolean) {
    setDailyState((prev) => new Map(prev).set(key, checked))
    await toggleChecklistItem(date, key, checked)
  }

  async function handleWeeklyToggle(key: string, checked: boolean) {
    setWeeklyState((prev) => new Map(prev).set(key, checked))
    await toggleWeeklyChecklistItem(weekStart, key, checked)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">每日清单</h1>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">今日任务</CardTitle>
            <span className="text-sm text-muted-foreground">
              {completedDaily}/{DAILY_CHECKLIST_ITEMS.length}
            </span>
          </div>
          <Progress value={(completedDaily / DAILY_CHECKLIST_ITEMS.length) * 100} className="h-1.5" />
        </CardHeader>
        <CardContent className="space-y-3">
          {DAILY_CHECKLIST_ITEMS.map((item) => {
            const checked = dailyState.get(item.key) ?? false
            return (
              <div key={item.key} className="flex items-center gap-3">
                <Checkbox
                  id={item.key}
                  checked={checked}
                  onCheckedChange={(val) => handleDailyToggle(item.key, !!val)}
                />
                <label
                  htmlFor={item.key}
                  className={`text-sm cursor-pointer ${checked ? 'line-through text-muted-foreground' : ''}`}
                >
                  {item.label}
                </label>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">本周任务</CardTitle>
            <span className="text-sm text-muted-foreground">
              {completedWeekly}/{WEEKLY_CHECKLIST_ITEMS.length}
            </span>
          </div>
          <Progress value={(completedWeekly / WEEKLY_CHECKLIST_ITEMS.length) * 100} className="h-1.5" />
        </CardHeader>
        <CardContent className="space-y-3">
          {WEEKLY_CHECKLIST_ITEMS.map((item) => {
            const checked = weeklyState.get(item.key) ?? false
            return (
              <div key={item.key} className="flex items-center gap-3">
                <Checkbox
                  id={item.key}
                  checked={checked}
                  onCheckedChange={(val) => handleWeeklyToggle(item.key, !!val)}
                />
                <label
                  htmlFor={item.key}
                  className={`text-sm cursor-pointer ${checked ? 'line-through text-muted-foreground' : ''}`}
                >
                  {item.label}
                </label>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
