'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { logProteinPowder } from '@/lib/actions'
import { getToday } from '@/lib/date-utils'
import { MEAL_SLOTS } from '@/lib/constants'
import type { MealSlot } from '@/types'

const PROTEIN_PER_SCOOP = 25

export default function ProteinPage() {
  const router = useRouter()
  const [slot, setSlot] = useState<MealSlot>('breakfast')
  const [scoops, setScoops] = useState<number>(1)
  const [loading, setLoading] = useState(false)

  const totalProtein = scoops * PROTEIN_PER_SCOOP

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (scoops <= 0) {
      toast.error('请选择勺数')
      return
    }
    setLoading(true)
    const result = await logProteinPowder(getToday(), slot, scoops)
    if (result.success) {
      toast.success(`蛋白粉已记录：${scoops}勺 (${totalProtein}g蛋白质)`)
      setTimeout(() => { router.push('/'); router.refresh() }, 500)
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
          <h1 className="text-lg font-semibold">记录蛋白粉</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>蛋白粉</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Slot selection */}
              <div className="space-y-2">
                <Label>搭配餐次</Label>
                <div className="grid grid-cols-5 gap-2">
                  {MEAL_SLOTS.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setSlot(s.key)}
                      className={`flex flex-col items-center gap-1 rounded-lg p-2 text-xs transition-colors ${
                        slot === s.key
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      <span className="text-lg">{s.icon}</span>
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scoop counter */}
              <div className="space-y-2">
                <Label>勺数</Label>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="h-16 w-20 text-2xl font-bold"
                    onClick={() => setScoops(Math.max(0.5, scoops - 0.5))}
                  >
                    -0.5
                  </Button>
                  <div className="text-center min-w-[80px]">
                    <div className="text-4xl font-bold">{scoops}</div>
                    <div className="text-sm text-muted-foreground">勺</div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="h-16 w-20 text-2xl font-bold"
                    onClick={() => setScoops(scoops + 0.5)}
                  >
                    +0.5
                  </Button>
                </div>
              </div>

              {/* Total protein display */}
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-sm text-muted-foreground">蛋白质摄入</div>
                <div className="text-3xl font-bold text-primary">{totalProtein}g</div>
                <div className="text-xs text-muted-foreground">{scoops} x {PROTEIN_PER_SCOOP}g/勺</div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={loading || scoops <= 0}
              >
                {loading ? '记录中...' : '记录蛋白粉'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
