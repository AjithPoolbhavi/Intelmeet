import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Video, Clock } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import Sidebar from '../components/ui/Sidebar';
import { meetingsAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Meeting } from '../types';

export default function CalendarPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const loadMeetings = useCallback(async () => {
    if (!user) return;
    try {
      const res = await meetingsAPI.getUserMeetings(user.id);
      setMeetings(res.data.meetings || []);
    } catch {}
  }, [user]);

  useEffect(() => {
    loadMeetings();
  }, [loadMeetings]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Calendar dates generation
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get padding days for calendar grid start (matching weekdays)
  const startDayOfWeek = monthStart.getDay(); // 0 is Sunday
  const paddingDays = Array.from({ length: startDayOfWeek });

  return (
    <div className="flex min-h-screen bg-[#0E0E11] text-slate-200">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 max-w-6xl mx-auto w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#0E71EB]/20">
                <CalendarIcon size={24} className="text-[#0E71EB]" />
              </div>
              Calendar Scheduler
            </h1>
            <p className="text-slate-400 text-sm mt-1">View and launch scheduled video conferences</p>
          </div>
        </div>

        {/* Calendar Nav */}
        <div className="bg-[#16161B] border border-slate-800 rounded-t-2xl p-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={prevMonth}
              className="p-2 hover:bg-slate-800 border border-slate-850 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => setCurrentMonth(new Date())}
              className="px-3 py-1.5 hover:bg-slate-800 border border-slate-850 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Today
            </button>
            <button 
              onClick={nextMonth}
              className="p-2 hover:bg-slate-800 border border-slate-850 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Grid Container */}
        <div className="bg-[#16161B] border-x border-b border-slate-800 rounded-b-2xl overflow-hidden shadow-xl flex-1 flex flex-col">
          {/* Week Days */}
          <div className="grid grid-cols-7 border-b border-slate-850 bg-[#1A1A22] text-center py-3">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <span key={d} className="text-xs font-bold text-slate-500 uppercase tracking-wider">{d}</span>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 flex-1 min-h-[500px]">
            {/* Empty grid boxes before start day */}
            {paddingDays.map((_, i) => (
              <div key={`pad-${i}`} className="border-r border-b border-slate-850/60 bg-[#121216]/20" />
            ))}

            {/* Actual day grid boxes */}
            {daysInMonth.map(day => {
              const dayMeetings = meetings.filter(m => {
                const mDate = new Date(m.startTime || m.createdAt);
                return isSameDay(day, mDate) && m.status !== 'ended';
              });

              return (
                <div key={day.toString()} className="border-r border-b border-slate-850 p-2 flex flex-col justify-between hover:bg-[#1A1A22]/50 transition-colors min-h-[90px]">
                  <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                    isSameDay(day, new Date()) ? 'bg-[#0E71EB] text-white font-extrabold shadow-lg shadow-[#0E71EB]/20' : 'text-slate-400'
                  }`}>
                    {format(day, 'd')}
                  </span>
                  
                  {/* Meeting Slots in Grid Cell */}
                  <div className="mt-2 space-y-1 overflow-y-auto flex-1 max-h-[80px]">
                    {dayMeetings.map(m => (
                      <button 
                        key={m.meetingId}
                        onClick={() => navigate(`/meeting/${m.meetingId}`)}
                        className="w-full text-left p-1 rounded bg-[#0E71EB]/10 border border-[#0E71EB]/20 hover:bg-[#0E71EB] hover:text-white transition-colors group"
                      >
                        <div className="flex items-center gap-1 min-w-0">
                          <Video size={10} className="text-[#0E71EB] group-hover:text-white flex-shrink-0" />
                          <p className="text-[9px] font-semibold truncate flex-1 leading-tight">{m.title}</p>
                        </div>
                        <p className="text-[8px] text-slate-500 group-hover:text-white/80 font-mono mt-0.5">
                          {format(new Date(m.startTime || m.createdAt), 'h:mm a')}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
