'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface HeaderProps {
  date?: string
  prevDate?: string
  nextDate?: string | null
  isToday?: boolean
}

export function Header({ date, prevDate, nextDate, isToday = true }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const hasNav = !!date

  const dateObj = date ? new Date(date + 'T00:00:00') : new Date()
  const displayStr = date
    ? `${dateObj.getMonth() + 1}月${dateObj.getDate()}日 ${['周日','周一','周二','周三','周四','周五','周六'][dateObj.getDay()]}`
    : ''

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {hasNav ? (
          <div className="flex items-center gap-1">
            <Link href={`/?date=${prevDate}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex flex-col items-center min-w-[120px]">
              <span className="text-sm font-medium">{displayStr}</span>
              {isToday ? (
                <span className="text-[10px] text-primary font-medium">今天</span>
              ) : (
                <Link href="/" className="text-[10px] text-muted-foreground hover:text-primary">
                  回到今天
                </Link>
              )}
            </div>
            {nextDate ? (
              <Link href={`/?date=${nextDate}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-30" disabled>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{displayStr}</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="h-9 w-9"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">切换主题</span>
        </Button>
      </div>
    </header>
  )
}
