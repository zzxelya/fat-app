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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { logBeverage } from '@/lib/actions'
import { getToday } from '@/lib/date-utils'
import { BEVERAGE_PRESETS } from '@/lib/constants'

export default function BeveragePage() {
  const router = useRouter()
  const [tab, setTab] = useState<string>('zero_cal')
  const [customName, setCustomName] = useState('')
  const [customCalories, setCustomCalories] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  async function handleQuickLog(name: string, category: string, calories: number) {
    setLoading(true)
    const result = await logBeverage(getToday(), name, category, calories)
    if (result.success) {
      toast.success(`${name} 已记录`)
      setTimeout(() => { router.push('/'); router.refresh() }, 500)
    } else {
      toast.error(result.error || '记录失败')
      setLoading(false)
    }
  }

  async function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!customName.trim()) {
      toast.error('请输入饮料名称')
      return
    }
    setLoading(true)
    const result = await logBeverage(getToday(), customName.trim(), 'controlled', customCalories)
    if (result.success) {
      toast.success(`${customName} 已记录`)
      router.push('/')
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
          <h1 className="text-lg font-semibold">记录饮料</h1>
        </div>

        <Card>
          <CardContent className="pt-4">
            <Tabs value={tab} onValueChange={(v) => v && setTab(v)}>
              <TabsList className="w-full">
                <TabsTrigger value="zero_cal" className="flex-1">零卡饮料</TabsTrigger>
                <TabsTrigger value="controlled" className="flex-1">需控制饮料</TabsTrigger>
              </TabsList>

              <TabsContent value="zero_cal" className="space-y-2 mt-4">
                <div className="space-y-2">
                  {BEVERAGE_PRESETS.zero_cal.map((preset, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="w-full h-14 justify-between text-base"
                      onClick={() => handleQuickLog(preset.name, 'zero_cal', preset.calories)}
                      disabled={loading}
                    >
                      <span>{preset.name}</span>
                      <span className="text-muted-foreground">{preset.calories}kcal</span>
                    </Button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="controlled" className="space-y-4 mt-4">
                <div className="space-y-2">
                  {BEVERAGE_PRESETS.controlled.map((preset, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="w-full h-14 justify-between text-base"
                      onClick={() => handleQuickLog(preset.name, 'controlled', preset.calories)}
                      disabled={loading}
                    >
                      <span>{preset.name}</span>
                      <span className="text-muted-foreground">{preset.calories}kcal</span>
                    </Button>
                  ))}
                </div>

                {/* Custom input */}
                <div className="border-t pt-4 space-y-3">
                  <div className="text-sm font-medium">自定义饮料</div>
                  <form onSubmit={handleCustomSubmit} className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="custom-name">名称</Label>
                      <Input
                        id="custom-name"
                        placeholder="饮料名称..."
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="custom-cal">热量 (kcal)</Label>
                      <Input
                        id="custom-cal"
                        type="number"
                        min={0}
                        value={customCalories || ''}
                        onChange={(e) => setCustomCalories(Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12"
                      disabled={loading || !customName.trim()}
                    >
                      {loading ? '记录中...' : '记录'}
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
