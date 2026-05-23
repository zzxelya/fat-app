'use client'

import Link from 'next/link'
import { CalorieRingWrapper } from '@/components/shared/calorie-ring'
import { MacroBar } from '@/components/shared/macro-bar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DAILY_TARGETS, MEAL_SLOTS, EXERCISE_TYPES } from '@/lib/constants'
import type { DailySummary, Meal, WaterLog, Exercise, DailyChecklistItem, ProteinPowderLog } from '@/types'
import { CheckCircle2, Circle, Dumbbell, GlassWater, FlaskConical } from 'lucide-react'

interface DashboardViewProps {
  summary: DailySummary | null
  meals: Meal[]
  water: WaterLog | null
  exercises: Exercise[]
  checklist: DailyChecklistItem[]
  proteinPowder: ProteinPowderLog[]
}

export function DashboardView({
  summary,
  meals,
  water,
  exercises,
  checklist,
  proteinPowder,
}: DashboardViewProps) {
  const consumedCalories = summary?.total_calories ?? 0
  const consumedProtein = summary?.total_protein_g ?? 0
  const consumedFat = summary?.total_fat_g ?? 0
  const consumedCarbs = summary?.total_carbs_g ?? 0
  const consumedWater = water?.ml ?? 0
  const exerciseCalories = summary?.exercise_calories ?? 0
  const netCalories = summary?.net_calories ?? 0

  const completedChecklist = checklist.filter((item) => item.completed).length
  const totalChecklist = checklist.length

  const totalScoops = proteinPowder.reduce((sum, p) => sum + p.scoops, 0)

  return (
    <div className="space-y-4">
      {/* Calorie + Water Rings */}
      <div className="flex items-center justify-center gap-6">
        <CalorieRingWrapper
          consumed={consumedCalories}
          target={DAILY_TARGETS.calories}
          label="卡路里"
          unit="kcal"
        />
        <CalorieRingWrapper
          consumed={consumedWater}
          target={DAILY_TARGETS.waterMl}
          label="饮水"
          unit="ml"
          color="var(--water)"
        />
      </div>

      {/* Net calories summary */}
      <div className="flex items-center justify-center gap-4 text-sm">
        <span className="text-muted-foreground">
          运动 -{exerciseCalories} kcal
        </span>
        <span className="text-muted-foreground">|</span>
        <span className="font-medium">
          净摄入 {netCalories} kcal
        </span>
      </div>

      {/* Macro Bar */}
      <Card>
        <CardContent>
          <MacroBar
            protein={{ current: consumedProtein, target: DAILY_TARGETS.proteinG }}
            fat={{ current: consumedFat, target: DAILY_TARGETS.fatG }}
            carbs={{ current: consumedCarbs, target: DAILY_TARGETS.carbsG }}
          />
        </CardContent>
      </Card>

      {/* Meal Cards */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground px-1">今日饮食</h3>
        <div className="space-y-2">
          {MEAL_SLOTS.map((slot) => {
            const meal = meals.find((m) => m.slot === slot.key)
            return (
              <Card key={slot.key} size="sm">
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{slot.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{slot.label}</span>
                          <span className="text-xs text-muted-foreground">{slot.time}</span>
                        </div>
                        {meal ? (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {meal.description}
                          </p>
                        ) : (
                          <span className="text-xs text-muted-foreground/60 mt-0.5">
                            目标 {slot.targetCal} kcal
                          </span>
                        )}
                      </div>
                    </div>
                    {meal ? (
                      <Badge variant="secondary" className="text-xs">
                        {meal.calories} kcal
                      </Badge>
                    ) : (
                      <Link
                        href={`/log/meals?slot=${slot.key}`}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        记录
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Exercise Cards */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground px-1">今日运动</h3>
        {exercises.length > 0 ? (
          <div className="space-y-2">
            {exercises.map((ex) => {
              const typeInfo = EXERCISE_TYPES.find((t) => t.value === ex.type)
              return (
                <Card key={ex.id} size="sm">
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{typeInfo?.icon ?? '🏋️'}</span>
                        <div>
                          <span className="text-sm font-medium">{typeInfo?.label ?? ex.type}</span>
                          <p className="text-xs text-muted-foreground">{ex.duration_min} 分钟</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        -{ex.calories_burned} kcal
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card size="sm">
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Dumbbell className="h-4 w-4" />
                  <span className="text-sm">暂无运动记录</span>
                </div>
                <Link
                  href="/log/exercise"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  记录
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Checklist + Protein Powder Row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Checklist Mini */}
        <Card size="sm">
          <CardContent>
            <Link href="/checklist" className="block">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground">每日清单</span>
                <span className="text-xs font-bold text-primary">
                  {completedChecklist}/{totalChecklist}
                </span>
              </div>
              <div className="flex gap-1">
                {checklist.map((item) =>
                  item.completed ? (
                    <CheckCircle2
                      key={item.item_key}
                      className="h-4 w-4 text-primary"
                    />
                  ) : (
                    <Circle
                      key={item.item_key}
                      className="h-4 w-4 text-muted-foreground/40"
                    />
                  )
                )}
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Protein Powder */}
        <Card size="sm">
          <CardContent>
            <Link href="/log/protein" className="block">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground">蛋白粉</span>
                <FlaskConical className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-lg font-bold">
                {totalScoops}
                <span className="text-xs font-normal text-muted-foreground ml-1">勺</span>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
