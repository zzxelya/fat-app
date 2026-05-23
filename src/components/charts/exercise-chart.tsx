'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ExerciseChartProps {
  data: { date: string; type: string; duration_min: number; calories_burned: number }[]
}

export function ExerciseChart({ data }: ExerciseChartProps) {
  const weekMap = new Map<string, { tennis: number; other: number; total: number }>()

  data.forEach((d) => {
    const weekStart = getWeekStart(d.date)
    const existing = weekMap.get(weekStart) || { tennis: 0, other: 0, total: 0 }
    if (d.type === 'tennis') {
      existing.tennis += 1
    } else {
      existing.other += 1
    }
    existing.total += 1
    weekMap.set(weekStart, existing)
  })

  const chartData = Array.from(weekMap.entries())
    .map(([week, counts]) => ({
      week: week.slice(5),
      网球: counts.tennis,
      其他: counts.other,
    }))
    .slice(-8)

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
        <XAxis dataKey="week" tick={{ fontSize: 11 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Bar dataKey="网球" stackId="a" fill="var(--primary)" radius={[0, 0, 0, 0]} />
        <Bar dataKey="其他" stackId="a" fill="var(--exercise)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function getWeekStart(dateStr: string): string {
  const d = new Date(dateStr)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d.setDate(diff))
  return monday.toISOString().split('T')[0]
}
