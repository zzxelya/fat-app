'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServer } from './supabase/server'

async function refreshSummary(date: string) {
  const supabase = await getSupabaseServer()
  await supabase.rpc('refresh_daily_summary', { target_date: date })
}

export async function logWeight(date: string, weightKg: number, note?: string) {
  const supabase = await getSupabaseServer()
  const { error } = await supabase
    .from('weight_logs')
    .upsert({ date, weight_kg: weightKg, note }, { onConflict: 'date' })
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  revalidatePath('/stats')
  return { success: true }
}

export async function logMeal(
  date: string,
  slot: string,
  description: string,
  calories: number,
  proteinG: number = 0,
  fatG: number = 0,
  carbsG: number = 0,
  isCafeteria: boolean = false
) {
  const supabase = await getSupabaseServer()
  const { error } = await supabase
    .from('meals')
    .upsert(
      { date, slot, description, calories, protein_g: proteinG, fat_g: fatG, carbs_g: carbsG, is_cafeteria: isCafeteria },
      { onConflict: 'date,slot' }
    )
  if (error) return { success: false, error: error.message }
  await refreshSummary(date)
  revalidatePath('/')
  revalidatePath('/stats')
  return { success: true }
}

export async function logWater(date: string, ml: number) {
  const supabase = await getSupabaseServer()
  const { error } = await supabase
    .from('water_logs')
    .upsert({ date, ml }, { onConflict: 'date' })
  if (error) return { success: false, error: error.message }
  await refreshSummary(date)
  revalidatePath('/')
  return { success: true }
}

export async function addWater(date: string, addMl: number) {
  const supabase = await getSupabaseServer()
  const { data: existing } = await supabase
    .from('water_logs')
    .select('ml')
    .eq('date', date)
    .single()
  const newMl = (existing?.ml ?? 0) + addMl
  const { error } = await supabase
    .from('water_logs')
    .upsert({ date, ml: newMl }, { onConflict: 'date' })
  if (error) return { success: false, error: error.message }
  await refreshSummary(date)
  revalidatePath('/')
  return { success: true }
}

export async function logProteinPowder(date: string, slot: string, scoops: number) {
  const supabase = await getSupabaseServer()
  const { error } = await supabase
    .from('protein_powder_logs')
    .insert({ date, slot, scoops })
  if (error) return { success: false, error: error.message }
  await refreshSummary(date)
  revalidatePath('/')
  return { success: true }
}

export async function logExercise(
  date: string,
  type: string,
  durationMin: number,
  caloriesBurned: number,
  note?: string
) {
  const supabase = await getSupabaseServer()
  const { error } = await supabase
    .from('exercises')
    .insert({ date, type, duration_min: durationMin, calories_burned: caloriesBurned, note })
  if (error) return { success: false, error: error.message }
  await refreshSummary(date)
  revalidatePath('/')
  revalidatePath('/stats')
  return { success: true }
}

export async function logBeverage(date: string, name: string, category: string, calories: number = 0) {
  const supabase = await getSupabaseServer()
  const { error } = await supabase
    .from('beverages')
    .insert({ date, name, category, calories })
  if (error) return { success: false, error: error.message }
  await refreshSummary(date)
  revalidatePath('/')
  return { success: true }
}

export async function logHunger(date: string, time: string, severity: number, actionTaken?: string, note?: string) {
  const supabase = await getSupabaseServer()
  const { error } = await supabase
    .from('hunger_logs')
    .insert({ date, time, severity, action_taken: actionTaken, note })
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  return { success: true }
}

export async function logCheatMeal(date: string, mealType: string, restaurant?: string, calories?: number, note?: string) {
  const supabase = await getSupabaseServer()
  const { error } = await supabase
    .from('cheat_meals')
    .insert({ date, meal_type: mealType, restaurant, calories, note })
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  revalidatePath('/cheat-meal')
  return { success: true }
}

export async function toggleChecklistItem(date: string, itemKey: string, completed: boolean) {
  const supabase = await getSupabaseServer()
  const { error } = await supabase
    .from('daily_checklist')
    .upsert({ date, item_key: itemKey, completed }, { onConflict: 'date,item_key' })
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  revalidatePath('/checklist')
  return { success: true }
}

export async function toggleWeeklyChecklistItem(weekStart: string, itemKey: string, completed: boolean) {
  const supabase = await getSupabaseServer()
  const { error } = await supabase
    .from('weekly_checklist')
    .upsert({ week_start: weekStart, item_key: itemKey, completed }, { onConflict: 'week_start,item_key' })
  if (error) return { success: false, error: error.message }
  revalidatePath('/checklist')
  return { success: true }
}

export async function initDailyChecklist(date: string) {
  const supabase = await getSupabaseServer()
  const items = [
    'morning_protein',
    'lunch_rice_reduced',
    'afternoon_snack',
    'dinner_meat_focus',
    'water_2l',
    'hunger_drink_first',
  ]
  const rows = items.map((key) => ({ date, item_key: key, completed: false }))
  const { error } = await supabase
    .from('daily_checklist')
    .upsert(rows, { onConflict: 'date,item_key', ignoreDuplicates: true })
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  revalidatePath('/checklist')
  return { success: true }
}
