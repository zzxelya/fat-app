import { AppShell } from '@/components/layout/app-shell'
import { getTodayChecklist } from '@/lib/data'
import { getToday, getWeekRange } from '@/lib/date-utils'
import { ChecklistView } from './checklist-view'
import { initDailyChecklist } from '@/lib/actions'
import { getSupabaseServer } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function ChecklistPage() {
  const today = getToday()
  const { start } = getWeekRange(new Date())

  await initDailyChecklist(today)

  const supabase = await getSupabaseServer()
  const [dailyData, weeklyData] = await Promise.all([
    getTodayChecklist(today),
    supabase.from('weekly_checklist').select('*').eq('week_start', start),
  ])

  return (
    <AppShell>
      <ChecklistView
        date={today}
        weekStart={start}
        dailyItems={dailyData}
        weeklyItems={weeklyData.data ?? []}
      />
    </AppShell>
  )
}
