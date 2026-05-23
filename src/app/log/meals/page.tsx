'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { logMeal } from '@/lib/actions'
import { getToday } from '@/lib/date-utils'
import { MEAL_SLOTS, MEAL_PRESETS } from '@/lib/constants'
import type { MealSlot } from '@/types'

export default function MealsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>}>
      <MealsContent />
    </Suspense>
  )
}

function MealsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const slotParam = searchParams.get('slot') as MealSlot | null

  const [slot, setSlot] = useState<MealSlot>(slotParam ?? 'breakfast')
  const [description, setDescription] = useState('')
  const [calories, setCalories] = useState<number>(0)
  const [protein, setProtein] = useState<number>(0)
  const [fat, setFat] = useState<number>(0)
  const [carbs, setCarbs] = useState<number>(0)
  const [isCafeteria, setIsCafeteria] = useState(false)
  const [macrosOpen, setMacrosOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (slotParam) setSlot(slotParam)
  }, [slotParam])

  function applyPreset(preset: { name: string; calories: number; protein: number; fat: number; carbs: number }) {
    setDescription(preset.name)
    setCalories(preset.calories)
    setProtein(preset.protein)
    setFat(preset.fat)
    setCarbs(preset.carbs)
    setMacrosOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim()) {
      toast.error('请输入食物描述')
      return
    }
    if (calories <= 0) {
      toast.error('请输入热量')
      return
    }
    setLoading(true)
    const result = await logMeal(
      getToday(),
      slot,
      description.trim(),
      calories,
      protein,
      fat,
      carbs,
      isCafeteria
    )
    if (result.success) {
      toast.success('饮食已记录')
      setTimeout(() => { router.push('/'); router.refresh() }, 500)
    } else {
      toast.error(result.error || '记录失败')
      setLoading(false)
    }
  }

  const presets = MEAL_PRESETS[slot] ?? []

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link href="/log">
            <Button variant="ghost" size="icon-sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">记录饮食</h1>
        </div>

        <Card>
          <CardContent className="pt-4 space-y-4">
            {/* Meal slot selector */}
            <div className="space-y-2">
              <Label>餐次</Label>
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

            {/* Presets */}
            {presets.length > 0 && (
              <div className="space-y-2">
                <Label>快速选择</Label>
                <div className="space-y-2">
                  {presets.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className="w-full text-left rounded-lg border p-3 text-sm hover:bg-muted transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{preset.name}</span>
                        <span className="text-muted-foreground">{preset.calories}kcal</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        蛋白{preset.protein}g / 脂肪{preset.fat}g / 碳水{preset.carbs}g
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">食物描述</Label>
                <Input
                  id="description"
                  placeholder="吃了什么..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* Calories */}
              <div className="space-y-2">
                <Label>热量 (kcal)</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="h-14 w-20 text-xl font-bold"
                    onClick={() => setCalories(Math.max(0, calories - 50))}
                  >
                    -50
                  </Button>
                  <Input
                    type="number"
                    value={calories || ''}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="text-2xl h-14 text-center font-semibold flex-1"
                    min={0}
                    placeholder="0"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="h-14 w-20 text-xl font-bold"
                    onClick={() => setCalories(calories + 50)}
                  >
                    +50
                  </Button>
                </div>
              </div>

              {/* Macros toggle */}
              <button
                type="button"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
                onClick={() => setMacrosOpen(!macrosOpen)}
              >
                {macrosOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                宏量营养素
              </button>

              {macrosOpen && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="protein" className="text-xs">蛋白质(g)</Label>
                    <Input
                      id="protein"
                      type="number"
                      min={0}
                      value={protein || ''}
                      onChange={(e) => setProtein(Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="fat" className="text-xs">脂肪(g)</Label>
                    <Input
                      id="fat"
                      type="number"
                      min={0}
                      value={fat || ''}
                      onChange={(e) => setFat(Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="carbs" className="text-xs">碳水(g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      min={0}
                      value={carbs || ''}
                      onChange={(e) => setCarbs(Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              )}

              {/* Cafeteria toggle */}
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={isCafeteria}
                  onCheckedChange={(checked) => setIsCafeteria(checked === true)}
                  id="cafeteria"
                />
                <Label htmlFor="cafeteria">食堂餐</Label>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={loading}
              >
                {loading ? '记录中...' : '记录饮食'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
