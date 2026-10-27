import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Plus, 
  Printer, 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  ChevronDown, 
  Heart, 
  Cake, 
  Users, 
  PartyPopper,
  BotMessageSquare,
  Building,
  RotateCcw
} from 'lucide-react';
import { EventPlan, EventType } from '../types';

interface NavbarProps {
  events: EventPlan[];
  activeEvent: EventPlan;
  onSelectEvent: (eventId: string) => void;
  onOpenWizard: () => void;
  onOpenChat: () => void;
  onOpenPrint: () => void;
  onOpenSettings: () => void;
  onResetData: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  events,
  activeEvent,
  onSelectEvent,
  onOpenWizard,
  onOpenChat,
  onOpenPrint,
  onOpenSettings,
  onResetData,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getEventIcon = (type: EventType) => {
    switch (type) {
      case 'wedding': return <Heart className="w-4 h-4 text-rose-500" />;
      case 'birthday': return <Cake className="w-4 h-4 text-amber-500" />;
      case 'community': return <Users className="w-4 h-4 text-emerald-500" />;
      case 'corporate': return <Building className="w-4 h-4 text-sky-500" />;
      default: return <PartyPopper className="w-4 h-4 text-purple-500" />;
    }
  };

  const calculateDaysUntil = (dateStr: string) => {
    try {
      const eventDate = new Date(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);
      const diffTime = eventDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today!';
      if (diffDays === 1) return 'Tomorrow';
      if (diffDays > 0) return `In ${diffDays} days`;
      return `${Math.abs(diffDays)} days ago`;
    } catch {
      return '';
    }
  };

  const daysLabel = calculateDaysUntil(activeEvent.date);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Active Event Picker */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => onSelectEvent(activeEvent.id)}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 via-amber-500 to-purple-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white animate-pulse-subtle" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-extrabold text-lg tracking-tight bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 dark:from-rose-400 dark:to-amber-300 bg-clip-text text-transparent">
                CelebrAItion
              </span>
              <span className="text-[10px] block font-semibold text-slate-400 -mt-1 tracking-wider uppercase">
                GenAI Event Planner
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* Event Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 text-sm font-medium transition-colors border border-slate-200/50 dark:border-slate-700"
            >
              {getEventIcon(activeEvent.eventType)}
              <span className="max-w-[130px] sm:max-w-[200px] truncate font-semibold">
                {activeEvent.title}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setDropdownOpen(false)} 
                />
                <div className="absolute left-0 mt-2 w-72 rounded-xl shadow-xl glass-dropdown py-2 z-30 animate-fade-in border border-slate-200 dark:border-slate-700">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Your Events ({events.length})
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
                    {events.map((evt) => (
                      <button
                        key={evt.id}
                        onClick={() => {
                          onSelectEvent(evt.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ${
                          evt.id === activeEvent.id ? 'bg-rose-50/80 dark:bg-rose-900/20 font-semibold text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 truncate">
                          {getEventIcon(evt.eventType)}
                          <div className="truncate">
                            <p className="truncate text-xs font-medium">{evt.title}</p>
                            <p className="text-[11px] text-slate-400">{evt.date}</p>
                          </div>
                        </div>
                        {evt.id === activeEvent.id && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1 pt-1 px-2 space-y-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenWizard();
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 transition-all shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Plan New Event with GenAI</span>
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onResetData();
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3 text-slate-400" />
                      <span>Reset to Sample Events</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Days until event chip */}
          {daysLabel && (
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40">
              <Calendar className="w-3 h-3 text-amber-500" />
              <span>{daysLabel}</span>
            </div>
          )}
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* AI PlanBot Assistant Trigger */}
          <button
            onClick={onOpenChat}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-800 transition-all shadow-sm group"
          >
            <BotMessageSquare className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Ask AI PlanBot</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          {/* Create New Event Button */}
          <button
            onClick={onOpenWizard}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Event</span>
          </button>

          {/* Print / Master PDF View */}
          <button
            onClick={onOpenPrint}
            title="Export & Print Master Plan"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            title="Settings & API Key"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            title="Toggle Theme"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>

      </div>
    </header>
  );
};
