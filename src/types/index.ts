export type MealSlot = 'breakfast' | 'lunch' | 'afternoon' | 'dinner' | 'night'
export type ExerciseType = 'tennis' | 'walking' | 'jump_rope' | 'hiit' | 'other'
export type BeverageCategory = 'zero_cal' | 'controlled' | 'water' | 'other'

export interface WeightLog {
  id: string
  date: string
  weight_kg: number
  note?: string
}

export interface Meal {
  id: string
  date: string
  slot: MealSlot
  description: string
  calories: number
  protein_g: number
  fat_g: number
  carbs_g: number
  is_cafeteria: boolean
}

export interface WaterLog {
  id: string
  date: string
  ml: number
  target_ml: number
}

export interface ProteinPowderLog {
  id: string
  date: string
  slot: MealSlot
  scoops: number
}

export interface Exercise {
  id: string
  date: string
  type: ExerciseType
  duration_min: number
  calories_burned: number
  note?: string
}

export interface CheatMeal {
  id: string
  date: string
  meal_type: string
  restaurant?: string
  calories?: number
  note?: string
}

export interface DailyChecklistItem {
  id: string
  date: string
  item_key: string
  completed: boolean
}

export interface WeeklyChecklistItem {
  id: string
  week_start: string
  item_key: string
  completed: boolean
}

export interface Phase {
  id: string
  phase_number: number
  name: string
  start_week: number
  end_week: number
  target_weight: number
  description?: string
}

export interface DailySummary {
  id: string
  date: string
  total_calories: number
  total_protein_g: number
  total_fat_g: number
  total_carbs_g: number
  total_water_ml: number
  total_protein_powder_scoops: number
  exercise_calories: number
  net_calories: number
}

export interface HungerLog {
  id: string
  date: string
  time: string
  severity: number
  action_taken?: string
  note?: string
}

export interface Beverage {
  id: string
  date: string
  name: string
  category: BeverageCategory
  calories: number
}
