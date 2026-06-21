import { useState } from "react";
import jMoment from "jalali-moment";
import { Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type JalaliDatePickerProps = {
  value: string;
  onChange: (date: string) => void;
};

export function JalaliDatePicker({ value, onChange }: JalaliDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    if (value) return jMoment(value, "jYYYY/jMM/jDD");
    return jMoment();
  });

  const handleDateSelect = (date: string) => {
    setSelectedDate(jMoment(date, "jYYYY/jMM/jDD"));
    onChange(date);
    setIsOpen(false);
  };

  const currentMonth = selectedDate.jMonth();
  const currentYear = selectedDate.jYear();

  const getDaysInMonth = () => {
    const daysInMonth = jMoment.jDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = jMoment(`${currentYear}/${currentMonth + 1}/1`, "jYYYY/jM/jD").day();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const nextMonth = () => {
    setSelectedDate(selectedDate.clone().add(1, "jMonth"));
  };

  const prevMonth = () => {
    setSelectedDate(selectedDate.clone().subtract(1, "jMonth"));
  };

  const monthNames = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
  ];

  const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-right gap-2"
        >
          <Calendar className="w-4 h-4" />
          <span>{value || "انتخاب تاریخ"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 bg-white dark:bg-slate-900" dir="rtl">
          {/* Month/Year Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              ←
            </button>
            <div className="font-bold text-slate-900 dark:text-white">
              {monthNames[currentMonth]} {currentYear}
            </div>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              →
            </button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="w-10 h-10 flex items-center justify-center text-sm font-medium text-slate-600 dark:text-slate-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth().map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="w-10 h-10" />;
              }

              const dateStr = `${currentYear}/${currentMonth + 1}/${day}`;
              const isSelected = value === jMoment(dateStr, "jYYYY/jM/jD").format("jYYYY/jMM/jDD");

              return (
                <button
                  key={day}
                  onClick={() => handleDateSelect(jMoment(dateStr, "jYYYY/jM/jD").format("jYYYY/jMM/jDD"))}
                  className={`w-10 h-10 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-sm ${
                    isSelected
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
