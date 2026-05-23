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
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { logHunger } from '@/lib/actions'
import { getToday } from '@/lib/date-utils'

const HUNGER_ACTIONS = [
  { value: '喝水并等待', label: '喝水并等待' },
  { value: '吃了低卡食物', label: '吃了低卡食物' },
  { value: '吃了蛋白粉', label: '吃了蛋白粉' },
  { value: '忍不住吃了高碳水', label: '忍不住吃了高碳水' },
]

const SEVERITY_LABELS = ['', '轻微', '有点饿', '中等', '很饿', '极度饥饿']

export default function HungerPage() {
  const router = useRouter()
  const [severity, setSeverity] = useState(3)
  const [actionTaken, setActionTaken] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!actionTaken) {
      toast.error('请选择应对方式')
      return
    }
    setLoading(true)
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const result = await logHunger(getToday(), time, severity, actionTaken, note || undefined)
    if (result.success) {
      toast.success('饥饿事件已记录')
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
          <h1 className="text-lg font-semibold">记录饥饿事件</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>饥饿记录</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Severity slider */}
              <div className="space-y-3">
                <Label>饥饿程度</Label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={severity}
                    onChange={(e) => setSeverity(Number(e.target.value))}
                    className="flex-1 h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                  />
                  <div className="text-center min-w-[60px]">
                    <div className="text-2xl font-bold">{severity}</div>
                    <div className="text-xs text-muted-foreground">{SEVERITY_LABELS[severity]}</div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground px-1">
                  <span>轻微</span>
                  <span>极度</span>
                </div>
              </div>

              {/* Action taken */}
              <div className="space-y-2">
                <Label>应对方式</Label>
                <Select value={actionTaken} onValueChange={(v) => v && setActionTaken(v)}>
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="选择应对方式..." />
                  </SelectTrigger>
                  <SelectContent>
                    {HUNGER_ACTIONS.map((action) => (
                      <SelectItem key={action.value} value={action.value}>
                        {action.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Note */}
              <div className="space-y-2">
                <Label htmlFor="note">备注（可选）</Label>
                <Textarea
                  id="note"
                  placeholder="当时的情况..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={loading || !actionTaken}
              >
                {loading ? '记录中...' : '记录饥饿事件'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
