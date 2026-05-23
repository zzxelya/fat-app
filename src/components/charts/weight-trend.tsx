'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine
} from 'recharts'

const PHASE_TARGETS = [102, 98, 92, 86, 80]

interface WeightTrendChartProps {
  data: { date: string; weight_kg: number }[]
}

export function WeightTrendChart({ data }: WeightTrendChartProps) {
  const chartData = data.map((d) => ({
    date: d.date.slice(5),
    weight: d.weight_kg,
    fullDate: d.date,
  }))

  const minWeight = Math.floor(Math.min(...data.map((d) => d.weight_kg)) - 2)
  const maxWeight = Math.ceil(Math.max(...data.map((d) => d.weight_kg)) + 2)

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11 }}
          className="text-muted-foreground"
        />
        <YAxis
          domain={[Math.min(minWeight, 78), Math.max(maxWeight, 104)]}
          tick={{ fontSize: 11 }}
          className="text-muted-foreground"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: any) => [`${value} kg`, '体重']}
          labelFormatter={(label) => `${label}`}
        />
        {PHASE_TARGETS.map((target, i) => (
          <ReferenceLine
            key={target}
            y={target}
            stroke="var(--primary)"
            strokeDasharray="4 4"
            strokeOpacity={0.4}
            label={{ value: `${target}kg`, fontSize: 10, fill: 'var(--primary)', opacity: 0.6 }}
          />
        ))}
        <Line
          type="monotone"
          dataKey="weight"
          stroke="var(--primary)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: 'var(--primary)' }}
          activeDot={{ r: 5, fill: 'var(--primary)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
