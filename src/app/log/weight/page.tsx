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
import { logWeight } from '@/lib/actions'
import { getToday } from '@/lib/date-utils'

export default function WeightPage() {
  const router = useRouter()
  const [weightKg, setWeightKg] = useState<string>('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const weight = parseFloat(weightKg)
    if (isNaN(weight) || weight < 40 || weight > 200) {
      toast.error('请输入有效体重（40-200kg）')
      return
    }
    setLoading(true)
    const result = await logWeight(getToday(), weight, note || undefined)
    if (result.success) {
      toast.success('体重已记录')
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
          <h1 className="text-lg font-semibold">记录体重</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>今日体重</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weight">体重 (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step={0.1}
                  min={40}
                  max={200}
                  placeholder="输入体重..."
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="text-2xl h-14 text-center font-semibold"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">备注（可选）</Label>
                <Textarea
                  id="note"
                  placeholder="有什么想记录的..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={loading || !weightKg}
              >
                {loading ? '记录中...' : '记录体重'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
