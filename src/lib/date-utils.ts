import { format, startOfWeek, endOfWeek, addDays, subDays, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function formatDisplayDate(date: Date): string {
  return format(date, 'M月d日 EEEE', { locale: zhCN })
}

export function getWeekRange(date: Date): { start: string; end: string } {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  const end = endOfWeek(date, { weekStartsOn: 1 })
  return {
    start: formatDate(start),
    end: formatDate(end),
  }
}

export function getToday(): string {
  return formatDate(new Date())
}

export function toDate(dateStr: string): Date {
  return parseISO(dateStr)
}

export { format, startOfWeek, endOfWeek, addDays, subDays, parseISO }
