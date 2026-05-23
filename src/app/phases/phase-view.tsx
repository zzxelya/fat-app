'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Target, TrendingDown } from 'lucide-react'

interface Phase {
  id: string
  phase_number: number
  name: string
  start_week: number
  end_week: number
  target_weight: number
  description: string
}

interface PhaseViewProps {
  phases: Phase[]
  currentWeight: number
  startingWeight: number
  targetWeight: number
  weeksElapsed: number
  weightHistory: { date: string; weight_kg: number }[]
}

export function PhaseView({
  phases,
  currentWeight,
  startingWeight,
  targetWeight,
  weeksElapsed,
  weightHistory,
}: PhaseViewProps) {
  const totalLoss = startingWeight - currentWeight
  const totalGoal = startingWeight - targetWeight
  const overallProgress = Math.min((totalLoss / totalGoal) * 100, 100)

  const currentPhase = phases.find(
    (p) => weeksElapsed >= p.start_week && weeksElapsed <= p.end_week
  ) ?? phases[0]

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">阶段目标</h1>

      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">总进度</p>
              <p className="text-2xl font-bold">
                {currentWeight}kg
                <span className="text-sm text-muted-foreground font-normal ml-2">
                  / {targetWeight}kg
                </span>
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>已减 {totalLoss.toFixed(1)}kg</span>
              <span>目标 {totalGoal}kg</span>
            </div>
            <Progress value={overallProgress} className="h-2.5" />
          </div>
          <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
            <span>第 {weeksElapsed} / 26 周</span>
            <span>距目标还需减 {(currentWeight - targetWeight).toFixed(1)}kg</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {phases.map((phase) => {
          const isActive = currentPhase?.phase_number === phase.phase_number
          const isCompleted = weeksElapsed > phase.end_week
          const phaseProgress = isActive
            ? ((weeksElapsed - phase.start_week + 1) / (phase.end_week - phase.start_week + 1)) * 100
            : isCompleted ? 100 : 0

          const phaseWeightLoss =
            phase.phase_number === 1
              ? startingWeight - phase.target_weight
              : phases[phase.phase_number - 2].target_weight - phase.target_weight

          return (
            <Card
              key={phase.id}
              className={isActive ? 'border-primary/50 bg-primary/5' : ''}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <Target className="h-4 w-4 text-primary" />
                    ) : isCompleted ? (
                      <Trophy className="h-4 w-4 text-success" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                    )}
                    <span className="font-medium">第{phase.phase_number}阶段: {phase.name}</span>
                  </div>
                  {isActive && <Badge variant="default" className="text-xs">当前</Badge>}
                  {isCompleted && <Badge variant="secondary" className="text-xs">已完成</Badge>}
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground mb-2">
                  <span>第{phase.start_week}-{phase.end_week}周</span>
                  <span>目标: {phase.target_weight}kg</span>
                  <span>需减: {phaseWeightLoss}kg</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{phase.description}</p>
                {(isActive || isCompleted) && (
                  <Progress value={phaseProgress} className="h-1.5" />
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
