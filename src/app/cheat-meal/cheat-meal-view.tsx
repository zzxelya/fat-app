'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CHEAT_MEAL_TYPES } from '@/lib/constants'
import { logCheatMeal } from '@/lib/actions'
import { toast } from 'sonner'
import { Timer, UtensilsCrossed, Star, AlertTriangle } from 'lucide-react'
import { differenceInDays } from 'date-fns'

interface CheatMeal {
  id: string
  date: string
  meal_type: string
  restaurant?: string
  calories?: number
  note?: string
}

interface CheatMealViewProps {
  today: string
  history: CheatMeal[]
  initialAllowed: boolean
}

export function CheatMealView({ today, history, initialAllowed }: CheatMealViewProps) {
  const [mealType, setMealType] = useState('')
  const [calories, setCalories] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const lastCheatMeal = history[0]
  const daysSinceLast = lastCheatMeal ? differenceInDays(new Date(today), new Date(lastCheatMeal.date)) : 999
  const daysUntilNext = Math.max(0, 14 - daysSinceLast)
  const allowed = initialAllowed

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!mealType) return
    setLoading(true)
    try {
      const result = await logCheatMeal(today, mealType, undefined, calories ? parseInt(calories) : undefined, note || undefined)
      if (result.success) {
        toast.success('欺骗餐已记录！享受美食吧 🎉')
        setMealType('')
        setCalories('')
        setNote('')
      } else {
        toast.error(result.error || '记录失败')
      }
    } catch {
      toast.error('网络错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">欺骗餐追踪</h1>

      <Card className={allowed ? 'border-green-500/30 bg-green-500/5' : 'border-destructive/30 bg-destructive/5'}>
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-3">
            {allowed ? (
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <UtensilsCrossed className="h-6 w-6 text-green-600" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <Timer className="h-6 w-6 text-destructive" />
              </div>
            )}
            <div>
              {allowed ? (
                <>
                  <p className="font-semibold text-green-700 dark:text-green-400">可以吃欺骗餐!</p>
                  <p className="text-xs text-muted-foreground">距上次已满14天</p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-destructive">冷却中</p>
                  <p className="text-xs text-muted-foreground">还需等待 {daysUntilNext} 天</p>
                </>
              )}
            </div>
          </div>
          {lastCheatMeal && (
            <div className="text-xs text-muted-foreground">
              上次欺骗餐: {lastCheatMeal.date} ({lastCheatMeal.meal_type}) · 已过 {daysSinceLast} 天
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">记录欺骗餐</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">类型</label>
              <Select value={mealType} onValueChange={(v) => v && setMealType(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择类型" />
                </SelectTrigger>
                <SelectContent>
                  {CHEAT_MEAL_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="flex items-center gap-2">
                        {type.value}
                        {type.rating > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {'★'.repeat(type.rating)}
                          </span>
                        )}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">预估热量 (kcal)</label>
              <Input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="如 1800"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">备注</label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="可选"
              />
            </div>
            {!allowed && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 text-warning text-xs">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>距上次欺骗餐不足14天。建议坚持计划，但如果你决定今天吃，也没关系。</span>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={!mealType || loading}>
              {loading ? '记录中...' : '记录欺骗餐'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">历史记录</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">暂无记录</p>
          ) : (
            <div className="space-y-2">
              {history.map((meal) => (
                <div key={meal.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{meal.meal_type}</p>
                    <p className="text-xs text-muted-foreground">{meal.date}</p>
                  </div>
                  {meal.calories && (
                    <Badge variant="secondary">{meal.calories} kcal</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">自助餐Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>✓ 安排在打球日</li>
            <li>✓ 另外两顿正常吃（不要空腹去）</li>
            <li>✓ 进场前喝一大杯水</li>
            <li>✓ 先吃肉和蔬菜，最后碰主食/甜品</li>
            <li>✓ 慢慢吃，别赶</li>
            <li>✓ 八分饱就停</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
