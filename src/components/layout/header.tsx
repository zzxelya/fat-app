'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDisplayDate } from '@/lib/date-utils'

export function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{formatDisplayDate(new Date())}</span>
        </div>
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
