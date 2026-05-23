import { getSupabaseServer } from './supabase/server'

export async function getTodaySummary(date: string) {
  const supabase = await getSupabaseServer()
  const { data } = await supabase
    .from('daily_summaries')
    .select('*')
    .eq('date', date)
    .single()
  return data
}

export async function getTodayMeals(date: string) {
  const supabase = await getSupabaseServer()
  const { data } = await supabase
    .from('meals')
    .select('*')
    .eq('date', date)
    .order('slot', { ascending: true })
  return data ?? []
}

export async function getTodayWater(date: string) {
  const supabase = await getSupabaseServer()
  const { data } = await supabase
    .from('water_logs')
    .select('*')
    .eq('date', date)
    .single()
  return data
}

export async function getTodayExercises(date: string) {
  const supabase = await getSupabaseServer()
  const { data } = await supabase
    .from('exercises')
    .select('*')
    .eq('date', date)
  return data ?? []
}

export async function getTodayChecklist(date: string) {
  const supabase = await getSupabaseServer()
  const { data } = await supabase
    .from('daily_checklist')
    .select('*')
    .eq('date', date)
  return data ?? []
}

export async function getTodayProteinPowder(date: string) {
  const supabase = await getSupabaseServer()
  const { data } = await supabase
    .from('protein_powder_logs')
    .select('*')
    .eq('date', date)
  return data ?? []
}

export async function getTodayBeverages(date: string) {
  const supabase = await getSupabaseServer()
  const { data } = await supabase
    .from('beverages')
    .select('*')
    .eq('date', date)
  return data ?? []
}

export async function getWeightHistory(days: number = 90) {
  const supabase = await getSupabaseServer()
  const { data } = await supabase
    .from('weight_logs')
    .select('date, weight_kg')
    .order('date', { ascending: true })
    .limit(days)
  return data ?? []
}

export async function getCalorieHistory(days: number = 30) {
  const supabase = await getSupabaseServer()
  const { data } = await supabase
    .from('daily_summaries')
    .select('date, total_calories, net_calories, exercise_calories, total_protein_g, total_fat_g, total_carbs_g')
    .order('date', { ascending: true })
    .limit(days)
  return data ?? []
}

export async function getCheatMealHistory() {
  const supabase = await getSupabaseServer()
  const { data } = await supabase
    .from('cheat_meals')
    .select('*')
    .order('date', { ascending: false })
    .limit(10)
  return data ?? []
}

export async function canHaveCheatMeal(date: string): Promise<boolean> {
  const supabase = await getSupabaseServer()
  const { data } = await supabase.rpc('can_have_cheat_meal', { check_date: date })
  return data ?? false
}

export async function getLatestWeight(): Promise<number | null> {
  const supabase = await getSupabaseServer()
  const { data } = await supabase
    .from('weight_logs')
    .select('weight_kg')
    .order('date', { ascending: false })
    .limit(1)
    .single()
  return data?.weight_kg ?? null
}

export async function getPhases() {
  const supabase = await getSupabaseServer()
  const { data } = await supabase
    .from('phases')
    .select('*')
    .order('phase_number', { ascending: true })
  return data ?? []
}

export async function getExerciseHistory(days: number = 30) {
  const supabase = await getSupabaseServer()
  const { data } = await supabase
    .from('exercises')
    .select('date, type, duration_min, calories_burned')
    .order('date', { ascending: true })
    .limit(days * 5)
  return data ?? []
}

export async function getProgressData(date: string) {
  const supabase = await getSupabaseServer()

  const [todaySummary, yesterdaySummary, todayWater, yesterdayWater, todayWeight, yesterdayWeight, allWeights, allSummaries] = await Promise.all([
    supabase.from('daily_summaries').select('*').eq('date', date).single(),
    supabase.from('daily_summaries').select('*').gt('date', '2020-01-01').lt('date', date).order('date', { ascending: false }).limit(1).single(),
    supabase.from('water_logs').select('ml').eq('date', date).single(),
    supabase.from('water_logs').select('ml').gt('date', '2020-01-01').lt('date', date).order('date', { ascending: false }).limit(1).single(),
    supabase.from('weight_logs').select('weight_kg').eq('date', date).single(),
    supabase.from('weight_logs').select('weight_kg, date').gt('date', '2020-01-01').lt('date', date).order('date', { ascending: false }).limit(1).single(),
    supabase.from('weight_logs').select('date, weight_kg').order('date', { ascending: true }),
    supabase.from('daily_summaries').select('date, total_calories, net_calories, total_protein_g, total_fat_g, total_carbs_g, exercise_calories').order('date', { ascending: true }),
  ])

  return {
    today: {
      summary: todaySummary.data,
      water: todayWater.data?.ml ?? 0,
      weight: todayWeight.data?.weight_kg ?? null,
    },
    yesterday: {
      summary: yesterdaySummary.data,
      water: yesterdayWater.data?.ml ?? 0,
      weight: yesterdayWeight.data?.weight_kg ?? null,
      date: yesterdayWeight.data?.date ?? null,
    },
    weightHistory: allWeights.data ?? [],
    summaryHistory: allSummaries.data ?? [],
  }
}
