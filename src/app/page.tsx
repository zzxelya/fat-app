import { AppShell } from '@/components/layout/app-shell'

export const dynamic = 'force-dynamic'
import { DashboardView } from '@/components/dashboard/dashboard-view'
import { getTodaySummary, getTodayMeals, getTodayWater, getTodayExercises, getTodayChecklist, getTodayProteinPowder } from '@/lib/data'
import { getToday, formatDate, addDays, subDays } from '@/lib/date-utils'
import { initDailyChecklist } from '@/lib/actions'

export default async function HomePage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const params = await searchParams
  const today = getToday()
  const date = params.date || today
  const isToday = date === today
  const prevDate = formatDate(subDays(new Date(date + 'T00:00:00'), 1))
  const nextDate = isToday ? null : formatDate(addDays(new Date(date + 'T00:00:00'), 1))

  // Seed checklist items for today only
  if (isToday) {
    await initDailyChecklist(today).catch(() => {})
  }

  const [summary, meals, water, exercises, checklist, proteinPowder] = await Promise.all([
    getTodaySummary(date).catch(() => null),
    getTodayMeals(date).catch(() => []),
    getTodayWater(date).catch(() => null),
    getTodayExercises(date).catch(() => []),
    getTodayChecklist(date).catch(() => []),
    getTodayProteinPowder(date).catch(() => []),
  ])

  return (
    <AppShell date={date} prevDate={prevDate} nextDate={nextDate} isToday={isToday}>
      <DashboardView
        date={date}
        isToday={isToday}
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
