import { AppShell } from '@/components/layout/app-shell'
import { getCheatMealHistory, canHaveCheatMeal } from '@/lib/data'
import { getToday } from '@/lib/date-utils'
import { CheatMealView } from './cheat-meal-view'

export const dynamic = 'force-dynamic'

export default async function CheatMealPage() {
  const today = getToday()
  const [history, allowed] = await Promise.all([
    getCheatMealHistory(),
    canHaveCheatMeal(today),
  ])

  return (
    <AppShell>
      <CheatMealView today={today} history={history} initialAllowed={allowed} />
    </AppShell>
  )
}
