'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Line, ComposedChart
} from 'recharts'
import { DAILY_TARGETS } from '@/lib/constants'

interface CalorieTrendChartProps {
  data: { date: string; total_calories: number; net_calories: number }[]
}

export function CalorieTrendChart({ data }: CalorieTrendChartProps) {
  const chartData = data.map((d) => ({
    date: d.date.slice(5),
    calories: d.total_calories,
    net: d.net_calories,
    over: d.total_calories > DAILY_TARGETS.calories * 1.1,
    near: d.total_calories > DAILY_TARGETS.calories * 0.9 && d.total_calories <= DAILY_TARGETS.calories * 1.1,
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis domain={[0, 3000]} tick={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          formatter={(value: unknown, name: unknown) => {
            const v = String(value)
            const n = String(name)
            if (n === 'calories') return [`${v} kcal`, '总热量']
            return [`${v} kcal`, '净热量']
          }}
        />
        <ReferenceLine
          y={DAILY_TARGETS.calories}
          stroke="var(--warning)"
          strokeDasharray="4 4"
          label={{ value: `${DAILY_TARGETS.calories}`, fontSize: 10, fill: 'var(--warning)' }}
        />
        <Bar
          dataKey="calories"
          radius={[4, 4, 0, 0]}
          fill="var(--primary)"
          fillOpacity={0.7}
        />
        <Line
          type="monotone"
          dataKey="net"
          stroke="var(--exercise)"
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
