'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { addWater, logWater } from '@/lib/actions'
import { getToday } from '@/lib/date-utils'
import { getTodayWater } from '@/lib/data'
import { DAILY_TARGETS } from '@/lib/constants'

export default function WaterPage() {
  const router = useRouter()
  const [currentMl, setCurrentMl] = useState(0)
  const [loading, setLoading] = useState(false)

  const target = DAILY_TARGETS.waterMl
  const percentage = Math.min(Math.round((currentMl / target) * 100), 100)
  const fillHeight = Math.min((currentMl / target) * 100, 100)

  useEffect(() => {
    getTodayWater(getToday()).then((data) => {
      if (data) setCurrentMl(data.ml)
    })
  }, [])

  async function handleAdd(ml: number) {
    setLoading(true)
    const result = await addWater(getToday(), ml)
    if (result.success) {
      setCurrentMl((prev) => prev + ml)
      toast.success(`+${ml}ml 已记录`)
    } else {
      toast.error(result.error || '记录失败')
    }
    setLoading(false)
  }

  async function handleReset() {
    setLoading(true)
    const result = await logWater(getToday(), 0)
    if (result.success) {
      setCurrentMl(0)
      toast.success('已重置')
    } else {
      toast.error(result.error || '重置失败')
    }
    setLoading(false)
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
          <h1 className="text-lg font-semibold">记录饮水</h1>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>今日饮水</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Water bottle visualization */}
            <div className="flex justify-center">
              <div className="relative w-32 h-48 rounded-b-3xl rounded-t-xl border-4 border-primary/30 overflow-hidden bg-muted">
                {/* Water fill */}
                <div
                  className="absolute bottom-0 left-0 right-0 bg-primary/40 transition-all duration-500 ease-out"
                  style={{ height: `${fillHeight}%` }}
                >
                  <div className="absolute top-0 left-0 right-0 h-3 bg-primary/20 rounded-b" />
                </div>
                {/* Water level text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{currentMl}</div>
                    <div className="text-xs text-muted-foreground">ml</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress info */}
            <div className="text-center space-y-1">
              <div className="text-sm text-muted-foreground">
                {currentMl} / {target}ml
              </div>
              <div className="text-lg font-semibold">{percentage}%</div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* Quick buttons */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                className="h-14 text-base font-semibold"
                onClick={() => handleAdd(250)}
                disabled={loading}
              >
                +250ml
              </Button>
              <Button
                className="h-14 text-base font-semibold"
                onClick={() => handleAdd(500)}
                disabled={loading}
              >
                +500ml
              </Button>
              <Button
                variant="outline"
                className="h-14 text-base"
                onClick={handleReset}
                disabled={loading}
              >
                重置
              </Button>
            </div>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => router.push('/')}
            >
              返回首页
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
