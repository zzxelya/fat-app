import { AppShell } from '@/components/layout/app-shell'

export const dynamic = 'force-dynamic'
import { DashboardView } from '@/components/dashboard/dashboard-view'
import { getTodaySummary, getTodayMeals, getTodayWater, getTodayExercises, getTodayChecklist, getTodayProteinPowder } from '@/lib/data'
import { getToday } from '@/lib/date-utils'
import { initDailyChecklist } from '@/lib/actions'

export default async function HomePage() {
  const today = getToday()

  // Seed checklist items for today (idempotent)
  await initDailyChecklist(today)

  // Fetch all today's data in parallel
  const [summary, meals, water, exercises, checklist, proteinPowder] = await Promise.all([
    getTodaySummary(today),
    getTodayMeals(today),
    getTodayWater(today),
    getTodayExercises(today),
    getTodayChecklist(today),
    getTodayProteinPowder(today),
  ])

  return (
    <AppShell>
      <DashboardView
        summary={summary}
        meals={meals}
        water={water}
        exercises={exercises}
        checklist={checklist}
        proteinPowder={proteinPowder}
      />
    </AppShell>
  )
}
