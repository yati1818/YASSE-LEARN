'use client';

import React from 'react';
import { Calendar as CalendarIcon, Flame, Brain, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CalendarStreakWidgetProps {
  calendarLogs: string[]; // YYYY-MM-DD
  videoStreakDays: number;
  brainStreakDays: number;
  onDateClick?: (dateStr: string) => void;
}

export const CalendarStreakWidget: React.FC<CalendarStreakWidgetProps> = ({
  calendarLogs = [],
  videoStreakDays = 5,
  brainStreakDays = 8,
}) => {
  // Use real current date
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonthName = monthNames[month];

  // Calculate days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0: Sun, 1: Mon, ...

  const todayStr = now.toISOString().split('T')[0];

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    const formattedMonth = (month + 1) < 10 ? `0${month + 1}` : `${month + 1}`;
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    const isLogged = calendarLogs.includes(dateStr);
    const isToday = dateStr === todayStr;

    return {
      dayNum,
      dateStr,
      isLogged,
      isToday,
    };
  });

  const weekHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
              <span>{currentMonthName} {year} Calendar Streak Tracker</span>
            </h3>
            <div className="text-xs text-slate-400">Real Date-by-Date Learning Logs</div>
          </div>
        </div>

        {/* Real Streak Counters */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-full bg-orange-950/60 border border-orange-500/40 text-orange-400 font-extrabold flex items-center gap-1">
            <Flame size={14} className="fill-orange-400 animate-flame-pulse" />
            <span>{videoStreakDays} Days Streak</span>
          </span>
        </div>
      </div>

      {/* Days Grid */}
      <div className="space-y-2">
        {/* Day names header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-500 pb-1">
          {weekHeaders.map((w) => (
            <div key={w}>{w}</div>
          ))}
        </div>

        {/* Calendar Cells */}
        <div className="grid grid-cols-7 gap-1.5 text-xs">
          {/* Empty padding cells for first week */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10 rounded-xl bg-slate-950/20" />
          ))}

          {/* Real Month Day Cells */}
          {daysArray.map((day) => (
            <motion.div
              key={day.dateStr}
              whileHover={{ scale: 1.08 }}
              className={`h-10 rounded-xl flex flex-col items-center justify-center relative font-bold transition-all border ${
                day.isLogged
                  ? 'bg-gradient-to-tr from-emerald-950 via-slate-900 to-orange-950 border-orange-500/50 text-orange-300 shadow-md shadow-orange-500/10'
                  : day.isToday
                    ? 'bg-slate-800 border-cyan-400 text-cyan-300 ring-2 ring-cyan-400/40'
                    : 'bg-slate-950 border-slate-800/80 text-slate-500'
              }`}
              title={day.isLogged ? `Active streak logged on ${day.dateStr}` : day.dateStr}
            >
              <span>{day.dayNum}</span>

              {day.isLogged && (
                <Flame size={10} className="text-orange-400 fill-orange-400 absolute bottom-1" />
              )}

              {day.isToday && !day.isLogged && (
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute bottom-1" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer info */}
      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-emerald-400" />
          <span>Watching a lecture automatically logs today's streak.</span>
        </span>
        <span className="text-cyan-300 font-mono text-[11px]">Today: {todayStr}</span>
      </div>
    </div>
  );
};
