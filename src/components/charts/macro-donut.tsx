'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { DAILY_TARGETS } from '@/lib/constants'

interface MacroDonutChartProps {
  data: { date: string; total_protein_g: number; total_fat_g: number; total_carbs_g: number }[]
}

export function MacroDonutChart({ data }: MacroDonutChartProps) {
  const latest = data[data.length - 1]
  if (!latest) return null

  const proteinCal = latest.total_protein_g * 4
  const fatCal = latest.total_fat_g * 9
  const carbsCal = latest.total_carbs_g * 4
  const total = proteinCal + fatCal + carbsCal || 1

  const chartData = [
    { name: '蛋白质', value: proteinCal, grams: latest.total_protein_g, color: 'var(--protein)' },
    { name: '脂肪', value: fatCal, grams: latest.total_fat_g, color: 'var(--fat)' },
    { name: '碳水', value: carbsCal, grams: latest.total_carbs_g, color: 'var(--carbs)' },
  ]

  return (
    <div className="space-y-4">
      <div className="relative">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any, name: any, item: any) => {
                const grams = item?.payload?.grams ?? 0
                return [`${grams}g (${value} kcal)`, String(name)]
              }}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold">{total}</div>
            <div className="text-xs text-muted-foreground">kcal</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-muted-foreground">{item.name} {item.grams}g</span>
          </div>
        ))}
      </div>
    </div>
  )
}
