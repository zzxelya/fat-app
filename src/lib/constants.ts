// 每日目标
export const DAILY_TARGETS = {
  calories: 2100,
  proteinG: 155,
  fatG: 65,
  carbsG: 220,
  waterMl: 2000,
} as const;

// 基础数据
export const PROFILE = {
  height: 183,
  startingWeight: 102,
  age: 23,
  gender: 'male' as const,
  targetWeight: 80,
  bmr: 2050,
  tdee: 2700,
  expectedWeeklyLoss: 0.6,
  expectedDurationWeeks: 26,
} as const;

// 餐次定义
export const MEAL_SLOTS = [
  { key: 'breakfast' as const, label: '早餐', targetCal: 450, time: '09:00', icon: '🌅' },
  { key: 'lunch' as const, label: '午餐', targetCal: 650, time: '11:15', icon: '☀️' },
  { key: 'afternoon' as const, label: '下午加餐', targetCal: 150, time: '15:30', icon: '🍎' },
  { key: 'dinner' as const, label: '晚餐', targetCal: 700, time: '17:00', icon: '🌙' },
  { key: 'night' as const, label: '夜间加餐', targetCal: 150, time: '23:00', icon: '🌃' },
] as const;

// 餐食预设
export const MEAL_PRESETS = {
  breakfast: [
    { name: '方案A: 蛋白粉+全麦面包+鸡蛋x2+牛奶', calories: 550, protein: 45, fat: 15, carbs: 60 },
    { name: '方案B: 蛋白粉+饭团+鸡蛋', calories: 400, protein: 30, fat: 10, carbs: 45 },
  ],
  lunch: [
    { name: '自选: 水煮肉片+豆腐+米饭2/3', calories: 650, protein: 40, fat: 20, carbs: 65 },
    { name: '自选: 椒麻鸡+青菜+米饭2/3', calories: 600, protein: 35, fat: 18, carbs: 60 },
    { name: '土豆牛肉拌饭(少酱)', calories: 680, protein: 30, fat: 22, carbs: 75 },
    { name: '麻辣拌(改良版)', calories: 650, protein: 25, fat: 20, carbs: 80 },
  ],
  afternoon: [
    { name: '蛋白粉半勺', calories: 65, protein: 18, fat: 1, carbs: 3 },
    { name: '无糖酸奶', calories: 90, protein: 5, fat: 3, carbs: 12 },
    { name: '坚果一小把(15g)', calories: 90, protein: 3, fat: 8, carbs: 3 },
    { name: '香蕉1根', calories: 100, protein: 1, fat: 0, carbs: 25 },
    { name: '鸡胸肉肠1根', calories: 90, protein: 15, fat: 3, carbs: 2 },
  ],
  dinner: [
    { name: '食堂: 鸡排+青菜+米饭半碗', calories: 550, protein: 35, fat: 15, carbs: 55 },
    { name: '食堂: 2荤1素+少饭', calories: 650, protein: 40, fat: 20, carbs: 60 },
    { name: '兰州拉面(普通碗)', calories: 600, protein: 25, fat: 15, carbs: 80 },
    { name: '猪脚饭(选瘦)', calories: 750, protein: 35, fat: 30, carbs: 65 },
    { name: '肯德基: 烤鸡腿堡+土豆泥', calories: 630, protein: 30, fat: 20, carbs: 70 },
    { name: '校外: 东北盒饭', calories: 650, protein: 30, fat: 20, carbs: 70 },
    { name: '校外: 牛肉粉(小碗)', calories: 550, protein: 25, fat: 12, carbs: 75 },
  ],
  night: [
    { name: '蛋白粉半勺', calories: 65, protein: 18, fat: 1, carbs: 3 },
    { name: '即食鸡胸肉1包', calories: 120, protein: 25, fat: 3, carbs: 2 },
    { name: '黄瓜/小番茄', calories: 20, protein: 0, fat: 0, carbs: 5 },
    { name: '无糖酸奶', calories: 80, protein: 5, fat: 3, carbs: 10 },
  ],
} as const;

// 运动类型
export const EXERCISE_TYPES = [
  { value: 'tennis' as const, label: '网球', calPerHour: 200, icon: '🎾' },
  { value: 'walking' as const, label: '快走', calPerHour: 300, icon: '🚶' },
  { value: 'jump_rope' as const, label: '跳绳', calPerHour: 600, icon: '⏭️' },
  { value: 'hiit' as const, label: '宿舍HIIT', calPerHour: 450, icon: '💪' },
  { value: 'other' as const, label: '其他', calPerHour: 300, icon: '🏋️' },
] as const;

// 饮料预设
export const BEVERAGE_PRESETS = {
  zero_cal: [
    { name: '无糖雪碧(树莓味)', calories: 0 },
    { name: '无糖可乐', calories: 0 },
    { name: '黑咖啡', calories: 5 },
    { name: '乌龙茶(无糖)', calories: 0 },
    { name: '绿茶(无糖)', calories: 0 },
  ],
  controlled: [
    { name: '奶茶(无糖)', calories: 150 },
    { name: '奶茶(三分糖)', calories: 200 },
    { name: '果汁', calories: 120 },
    { name: '啤酒', calories: 150 },
  ],
} as const;

// 欺骗餐类型
export const CHEAT_MEAL_TYPES = [
  { value: '潮汕牛肉火锅自助', rating: 5 },
  { value: '烤肉自助', rating: 4 },
  { value: '寿喜烧自助', rating: 5 },
  { value: '其他', rating: 0 },
] as const;

// 每日清单项
export const DAILY_CHECKLIST_ITEMS = [
  { key: 'morning_protein', label: '早上喝1勺蛋白粉' },
  { key: 'lunch_rice_reduced', label: '午餐主食减量1/3' },
  { key: 'afternoon_snack', label: '下午3-4点加餐' },
  { key: 'dinner_meat_focus', label: '晚餐选肉菜为主' },
  { key: 'water_2l', label: '喝够2L水' },
  { key: 'hunger_drink_first', label: '饿了先喝水等10分钟' },
] as const;

// 每周清单项
export const WEEKLY_CHECKLIST_ITEMS = [
  { key: 'weigh_in', label: '周末称体重(空腹)' },
  { key: 'grocery_shopping', label: '便利店采购' },
] as const;

// 频率限制
export const FREQUENCY_LIMITS = {
  malaban: { weekly: 1 },
  kfc: { weekly: 1 },
  jiangxi_noodles: { weekly: 1 },
  milk_tea: { weekly: 1 },
  cheat_meal: { biweekly: 1 },
} as const;
