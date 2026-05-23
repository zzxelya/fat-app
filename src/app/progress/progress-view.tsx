'use client'

import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PROFILE } from '@/lib/constants'
import { TrendingUp, TrendingDown, Minus, Weight, Flame, GlassWater, Beef, Wheat, Droplets } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, AreaChart, Area
} from 'recharts'

interface ProgressViewProps {
  date: string
  prevDate: string
  nextDate: string | null
  isToday: boolean
  today: {
    summary: Record<string, number | string | null> | null
    water: number
    weight: number | null
  }
  yesterday: {
    summary: Record<string, number | string | null> | null
    water: number
    weight: number | null
    date: string | null
  }
  weightHistory: { date: string; weight_kg: number }[]
  summaryHistory: { date: string; total_calories: number; net_calories: number; total_protein_g: number; total_fat_g: number; total_carbs_g: number; exercise_calories: number }[]
}

function ChangeBadge({ current, previous, unit, invert = false }: { current: number; previous: number; unit: string; invert?: boolean }) {
  if (previous === 0 && current === 0) return <Badge variant="secondary" className="text-xs">-</Badge>
  const diff = current - previous
  const isGood = invert ? diff > 0 : diff < 0
  const isNeutral = diff === 0
  if (isNeutral) {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Minus className="h-3 w-3" /> 0{unit}
      </span>
    )
  }
  return (
    <span className={`flex items-center gap-1 text-xs font-medium ${isGood ? 'text-green-500' : 'text-red-500'}`}>
      {diff > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {diff > 0 ? '+' : ''}{diff.toFixed(1)}{unit}
    </span>
  )
}

export function ProgressView({
  date,
  prevDate,
  nextDate,
  isToday,
  today,
  yesterday,
  weightHistory,
  summaryHistory,
}: ProgressViewProps) {
  const tc = today.summary
  const yc = yesterday.summary
  const startWeight = PROFILE.startingWeight
  const currentWeight = today.weight ?? (yesterday.weight ?? startWeight)

  // Overall progress
  const totalLost = startWeight - currentWeight
  const totalToLose = startWeight - PROFILE.targetWeight
  const progressPct = totalToLose > 0 ? Math.max(0, Math.min(100, (totalLost / totalToLose) * 100)) : 0

  // Weight chart data
  const wData = weightHistory.map(d => ({
    date: d.date.slice(5),
    weight: d.weight_kg,
  }))

  // Calorie chart data (last 30)
  const cData = summaryHistory.slice(-30).map(d => ({
    date: d.date.slice(5),
    calories: d.total_calories,
  }))

  // Macro chart data (last 30)
  const pData = summaryHistory.slice(-30).map(d => ({
    date: d.date.slice(5),
    protein: d.total_protein_g,
    fat: d.total_fat_g,
    carbs: d.total_carbs_g,
  }))

  return (
    <AppShell date={date} prevDate={prevDate} nextDate={nextDate} isToday={isToday}>
      <div className="space-y-4">

        {/* Overall Progress */}
        <Card>
          <CardContent className="pt-4">
            <div className="text-center mb-3">
              <h2 className="text-sm font-semibold text-muted-foreground mb-1">总体进度</h2>
              <div className="text-3xl font-bold">
                {currentWeight}<span className="text-base font-normal text-muted-foreground ml-1">kg</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {startWeight}kg → {PROFILE.targetWeight}kg · 已减 <span className="text-green-500 font-medium">{totalLost.toFixed(1)}kg</span>
              </div>
            </div>
            <div className="relative h-4 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 bottom-0 bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{startWeight}kg</span>
              <span className="font-medium text-green-500">{progressPct.toFixed(1)}%</span>
              <span>{PROFILE.targetWeight}kg</span>
            </div>
          </CardContent>
        </Card>

        {/* Day-over-Day Comparison */}
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">与前一天对比</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Weight className="h-4 w-4 text-primary" />
                  <span className="text-sm">体重</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{yesterday.weight?.toFixed(1) ?? '-'}kg</span>
                  <span className="text-xs">→</span>
                  <span className="text-sm font-medium">{today.weight?.toFixed(1) ?? '-'}kg</span>
                  {today.weight != null && yesterday.weight != null && (
                    <ChangeBadge current={today.weight} previous={yesterday.weight} unit="kg" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-[var(--carbs)]" />
                  <span className="text-sm">卡路里</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{yc?.total_calories ?? 0}kcal</span>
                  <span className="text-xs">→</span>
                  <span className="text-sm font-medium">{tc?.total_calories ?? 0}kcal</span>
                  <ChangeBadge current={Number(tc?.total_calories ?? 0)} previous={Number(yc?.total_calories ?? 0)} unit="kcal" invert />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Beef className="h-4 w-4 text-[var(--protein)]" />
                  <span className="text-sm">蛋白质</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{yc?.total_protein_g ?? 0}g</span>
                  <span className="text-xs">→</span>
                  <span className="text-sm font-medium">{tc?.total_protein_g ?? 0}g</span>
                  <ChangeBadge current={Number(tc?.total_protein_g ?? 0)} previous={Number(yc?.total_protein_g ?? 0)} unit="g" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wheat className="h-4 w-4 text-[var(--carbs)]" />
                  <span className="text-sm">碳水</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{yc?.total_carbs_g ?? 0}g</span>
                  <span className="text-xs">→</span>
                  <span className="text-sm font-medium">{tc?.total_carbs_g ?? 0}g</span>
                  <ChangeBadge current={Number(tc?.total_carbs_g ?? 0)} previous={Number(yc?.total_carbs_g ?? 0)} unit="g" invert />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-[var(--fat)]" />
                  <span className="text-sm">脂肪</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{yc?.total_fat_g ?? 0}g</span>
                  <span className="text-xs">→</span>
                  <span className="text-sm font-medium">{tc?.total_fat_g ?? 0}g</span>
                  <ChangeBadge current={Number(tc?.total_fat_g ?? 0)} previous={Number(yc?.total_fat_g ?? 0)} unit="g" invert />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GlassWater className="h-4 w-4 text-[var(--water)]" />
                  <span className="text-sm">饮水</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{yesterday.water}ml</span>
                  <span className="text-xs">→</span>
                  <span className="text-sm font-medium">{today.water}ml</span>
                  <ChangeBadge current={today.water} previous={yesterday.water} unit="ml" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weight Trend */}
        {wData.length >= 2 && (
          <Card>
            <CardContent className="pt-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">体重变化曲线</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={wData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => [`${value} kg`, '体重']}
                  />
                  <ReferenceLine y={PROFILE.targetWeight} stroke="var(--primary)" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: `${PROFILE.targetWeight}kg`, fontSize: 10, fill: 'var(--primary)', opacity: 0.6 }} />
                  <Area type="monotone" dataKey="weight" stroke="var(--primary)" strokeWidth={2} fill="url(#weightGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Calorie Trend */}
        {cData.length >= 2 && (
          <Card>
            <CardContent className="pt-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">热量变化曲线</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={cData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 3000]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => [`${value} kcal`, '热量']}
                  />
                  <ReferenceLine y={2100} stroke="var(--warning)" strokeDasharray="4 4" label={{ value: '2100', fontSize: 10, fill: 'var(--warning)' }} />
                  <Line type="monotone" dataKey="calories" stroke="var(--carbs)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Macro Trend */}
        {pData.length >= 2 && (
          <Card>
            <CardContent className="pt-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">宏量营养素趋势</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={pData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any, name: any) => {
                      const labels: Record<string, string> = { protein: '蛋白质', fat: '脂肪', carbs: '碳水' }
                      return [`${value}g`, labels[String(name)] ?? String(name)]
                    }}
                  />
                  <Line type="monotone" dataKey="protein" stroke="var(--protein)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="carbs" stroke="var(--carbs)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="fat" stroke="var(--fat)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-xs"><span className="w-3 h-0.5 bg-[var(--protein)] inline-block" /> 蛋白质</span>
                <span className="flex items-center gap-1 text-xs"><span className="w-3 h-0.5 bg-[var(--carbs)] inline-block" /> 碳水</span>
                <span className="flex items-center gap-1 text-xs"><span className="w-3 h-0.5 bg-[var(--fat)] inline-block" /> 脂肪</span>
              </div>
            </CardContent>
          </Card>
        )}

        {weightHistory.length === 0 && summaryHistory.length === 0 && (
          <Card>
            <CardContent className="pt-4 text-center py-8">
              <p className="text-muted-foreground text-sm">还没有记录数据</p>
              <p className="text-muted-foreground text-xs mt-1">开始记录体重和饮食后，变化趋势将在这里展示</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  )
}
