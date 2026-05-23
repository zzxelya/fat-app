import { AppShell } from '@/components/layout/app-shell'
import { HistoryView } from './history-view'
import { getSupabaseServer } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

async function getHistoryData(month: string) {
  const supabase = await getSupabaseServer()
  const startDate = `${month}-01`
  const endDate = `${month}-31`

  const [meals, exercises, water, weight] = await Promise.all([
    supabase.from('meals').select('date, slot, calories').gte('date', startDate).lte('date', endDate),
    supabase.from('exercises').select('date, type, duration_min').gte('date', startDate).lte('date', endDate),
    supabase.from('water_logs').select('date, ml').gte('date', startDate).lte('date', endDate),
    supabase.from('weight_logs').select('date, weight_kg').gte('date', startDate).lte('date', endDate),
  ])

  return {
    meals: meals.data ?? [],
    exercises: exercises.data ?? [],
    water: water.data ?? [],
    weight: weight.data ?? [],
  }
}

export default async function HistoryPage() {
  const now = new Date()
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const data = await getHistoryData(month)

  return (
    <AppShell>
      <HistoryView initialMonth={month} initialData={data} />
    </AppShell>
  )
}
