'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { logExercise } from '@/lib/actions'
import { getToday } from '@/lib/date-utils'
import { EXERCISE_TYPES } from '@/lib/constants'
import type { ExerciseType } from '@/types'

export default function ExercisePage() {
  const router = useRouter()
  const [type, setType] = useState<ExerciseType>('walking')
  const [duration, setDuration] = useState<number>(0)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedType = EXERCISE_TYPES.find((t) => t.value === type)!
  const caloriesBurned = Math.round(selectedType.calPerHour * duration / 60)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (duration <= 0) {
      toast.error('请输入运动时长')
      return
    }
    setLoading(true)
    const result = await logExercise(getToday(), type, duration, caloriesBurned, note || undefined)
    if (result.success) {
      toast.success(`运动已记录，消耗 ${caloriesBurned} kcal`)
      setTimeout(() => { router.push('/progress'); router.refresh() }, 500)
    } else {
      toast.error(result.error || '记录失败')
      setLoading(false)
    }
  }

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link href="/log">
            <Button variant="ghost" size="icon-sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">记录运动</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>运动类型</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Exercise type selection */}
              <div className="space-y-2">
                <Label>类型</Label>
                <div className="grid grid-cols-5 gap-2">
                  {EXERCISE_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setType(t.value)}
                      className={`flex flex-col items-center gap-1 rounded-lg p-3 text-xs transition-colors ${
                        type === t.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      <span className="text-2xl">{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">时长（分钟）</Label>
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  value={duration || ''}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  placeholder="输入运动时长..."
                  className="text-2xl h-14 text-center font-semibold"
                  required
                />
              </div>

              {/* Calories burned display */}
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-sm text-muted-foreground">预计消耗</div>
                <div className="text-3xl font-bold text-primary">
                  {caloriesBurned} <span className="text-base font-normal">kcal</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {selectedType.label} {selectedType.calPerHour}kcal/h x {duration}min
                </div>
              </div>

              {/* Note */}
              <div className="space-y-2">
                <Label htmlFor="note">备注（可选）</Label>
                <Textarea
                  id="note"
                  placeholder="运动情况..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={loading || duration <= 0}
              >
                {loading ? '记录中...' : '记录运动'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
