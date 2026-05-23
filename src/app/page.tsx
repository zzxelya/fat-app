import { AppShell } from '@/components/layout/app-shell'

export const dynamic = 'force-dynamic'
import { DashboardView } from '@/components/dashboard/dashboard-view'
import { getTodaySummary, getTodayMeals, getTodayWater, getTodayExercises, getTodayChecklist, getTodayProteinPowder } from '@/lib/data'
import { getToday } from '@/lib/date-utils'
import { initDailyChecklist } from '@/lib/actions'

export default async function HomePage() {
  const today = getToday()

  // Seed checklist items for today (idempotent) — don't crash on failure
  await initDailyChecklist(today).catch(() => {})

  // Fetch all today's data in parallel
  const [summary, meals, water, exercises, checklist, proteinPowder] = await Promise.all([
    getTodaySummary(today).catch(() => null),
    getTodayMeals(today).catch(() => []),
    getTodayWater(today).catch(() => null),
    getTodayExercises(today).catch(() => []),
    getTodayChecklist(today).catch(() => []),
    getTodayProteinPowder(today).catch(() => []),
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
