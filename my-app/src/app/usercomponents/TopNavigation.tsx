import { useState } from 'react';
import { Search, Bell, Moon, Sun, Settings } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { aiSuggestions } from '../data/mockData';

interface TopNavigationProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function TopNavigation({
  darkMode,
  toggleDarkMode,
  searchQuery,
  setSearchQuery,
}: TopNavigationProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="border-b bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-4 px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TD</span>
          </div>
          <span className="font-semibold text-lg hidden md:block dark:text-white">
            Technical Docs
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl relative">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="جستجوی اسناد فنی، کد سند، یا موضوع..."
              className="pr-10 text-right bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
          </div>
          
          {/* Smart Suggestions */}
          {showSuggestions && searchQuery.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
              <div className="p-2">
                <p className="text-xs text-slate-500 px-3 py-2 text-right">پیشنهادات هوشمند</p>
                {aiSuggestions
                  .filter((s) => s.includes(searchQuery))
                  .map((suggestion, idx) => (
                    <button
                      key={idx}
                      className="w-full text-right px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-sm"
                      onClick={() => setSearchQuery(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-3">
                <p className="font-semibold mb-2">اعلان‌ها</p>
                <div className="space-y-2">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded text-sm">
                    <p className="text-right">سند جدید TAV234-18/00 منتشر شد</p>
                    <p className="text-xs text-slate-500 text-right mt-1">2 ساعت پیش</p>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded text-sm">
                    <p className="text-right">به‌روزرسانی دستورالعمل GIS</p>
                    <p className="text-xs text-slate-500 text-right mt-1">5 ساعت پیش</p>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>

          {/* User Profile */}
          <div className="flex items-center gap-2 pr-4 border-r border-slate-200 dark:border-slate-700">
            <div className="text-right">
              <p className="text-sm font-medium dark:text-white">محمد احمدی</p>
              <p className="text-xs text-slate-500">مهندس ارشد</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">م</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
