import { AppShell } from '@/components/layout/app-shell'
import { getWeightHistory, getCalorieHistory, getExerciseHistory } from '@/lib/data'
import { StatsView } from './stats-view'

export const dynamic = 'force-dynamic'

export default async function StatsPage() {
  const [weightData, calorieData, exerciseData] = await Promise.all([
    getWeightHistory(90),
    getCalorieHistory(30),
    getExerciseHistory(30),
  ])

  return (
    <AppShell>
      <div className="space-y-6">
        <h1 className="text-xl font-bold">数据趋势</h1>
        <StatsView
          weightData={weightData}
          calorieData={calorieData}
          exerciseData={exerciseData}
        />
      </div>
    </AppShell>
  )
}
