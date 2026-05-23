import { AppShell } from '@/components/layout/app-shell'
import { getPhases, getLatestWeight, getWeightHistory } from '@/lib/data'
import { PhaseView } from './phase-view'
import { PROFILE } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function PhasesPage() {
  const [phases, latestWeight, weightHistory] = await Promise.all([
    getPhases(),
    getLatestWeight(),
    getWeightHistory(200),
  ])

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 7 * 26)
  const weeksElapsed = Math.floor((Date.now() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000))

  return (
    <AppShell>
      <PhaseView
        phases={phases}
        currentWeight={latestWeight ?? PROFILE.startingWeight}
        startingWeight={PROFILE.startingWeight}
        targetWeight={PROFILE.targetWeight}
        weeksElapsed={Math.min(weeksElapsed, 26)}
        weightHistory={weightHistory}
      />
    </AppShell>
  )
}
