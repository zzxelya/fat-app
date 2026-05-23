'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import dynamic from 'next/dynamic'

const WeightTrendChart = dynamic(
  () => import('@/components/charts/weight-trend').then((m) => m.WeightTrendChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
)
const CalorieTrendChart = dynamic(
  () => import('@/components/charts/calorie-trend').then((m) => m.CalorieTrendChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
)
const MacroDonutChart = dynamic(
  () => import('@/components/charts/macro-donut').then((m) => m.MacroDonutChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
)
const ExerciseChart = dynamic(
  () => import('@/components/charts/exercise-chart').then((m) => m.ExerciseChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
)

function ChartSkeleton() {
  return <div className="h-64 bg-muted/20 rounded-lg animate-pulse" />
}

interface StatsViewProps {
  weightData: { date: string; weight_kg: number }[]
  calorieData: { date: string; total_calories: number; net_calories: number; total_protein_g: number; total_fat_g: number; total_carbs_g: number }[]
  exerciseData: { date: string; type: string; duration_min: number; calories_burned: number }[]
}

export function StatsView({ weightData, calorieData, exerciseData }: StatsViewProps) {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="weight">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="weight">体重</TabsTrigger>
          <TabsTrigger value="calories">热量</TabsTrigger>
          <TabsTrigger value="macros">营养素</TabsTrigger>
          <TabsTrigger value="exercise">运动</TabsTrigger>
        </TabsList>
        <TabsContent value="weight" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">体重趋势</CardTitle>
            </CardHeader>
            <CardContent>
              {weightData.length > 0 ? (
                <WeightTrendChart data={weightData} />
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                  暂无体重数据，开始记录吧
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calories" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">每日热量</CardTitle>
            </CardHeader>
            <CardContent>
              {calorieData.length > 0 ? (
                <CalorieTrendChart data={calorieData} />
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                  暂无热量数据
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="macros" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">宏量素分布</CardTitle>
            </CardHeader>
            <CardContent>
              {calorieData.length > 0 ? (
                <MacroDonutChart data={calorieData} />
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                  暂无营养素数据
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="exercise" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">运动频率</CardTitle>
            </CardHeader>
            <CardContent>
              {exerciseData.length > 0 ? (
                <ExerciseChart data={exerciseData} />
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                  暂无运动数据
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
