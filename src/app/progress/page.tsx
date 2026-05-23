import { getProgressData } from '@/lib/data'
import { getToday, formatDate, addDays, subDays } from '@/lib/date-utils'
import { ProgressView } from './progress-view'

export const dynamic = 'force-dynamic'

export default async function ProgressPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const params = await searchParams
  const today = getToday()
  const date = params.date || today
  const isToday = date === today
  const prevDate = formatDate(subDays(new Date(date + 'T00:00:00'), 1))
  const nextDate = isToday ? null : formatDate(addDays(new Date(date + 'T00:00:00'), 1))

  const data = await getProgressData(date).catch(() => ({
    today: { summary: null, water: 0, weight: null },
    yesterday: { summary: null, water: 0, weight: null, date: null },
    weightHistory: [],
    summaryHistory: [],
  }))

  return (
    <ProgressView
      date={date}
      prevDate={prevDate}
      nextDate={nextDate}
      isToday={isToday}
      today={data.today}
      yesterday={data.yesterday}
      weightHistory={data.weightHistory}
      summaryHistory={data.summaryHistory}
    />
  )
}
