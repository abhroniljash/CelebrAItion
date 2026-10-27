import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Wallet, 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  Clock, 
  DollarSign, 
  Lightbulb, 
  Shirt, 
  Bookmark,
  Share2
} from 'lucide-react';
import { EventPlan } from '../types';

interface EventOverviewProps {
  event: EventPlan;
  onNavigateTab: (tab: string) => void;
  onOpenChat: () => void;
  onOpenPrint: () => void;
}

export const EventOverview: React.FC<EventOverviewProps> = ({
  event,
  onNavigateTab,
  onOpenChat,
  onOpenPrint
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState(false);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  // Metrics calculations
  const totalCommitted = event.budgetItems.reduce((acc, item) => acc + (item.actualCost > 0 ? item.actualCost : item.estimatedCost), 0);
  const totalPaid = event.budgetItems.reduce((acc, item) => acc + item.paidAmount, 0);
  const remainingBudget = event.totalBudget - totalCommitted;
  const budgetSpentPercent = Math.min(Math.round((totalCommitted / event.totalBudget) * 100), 100);

  const completedTimeline = event.timelineItems.filter(t => t.completed).length;
  const totalTimeline = event.timelineItems.length;
  const timelinePercent = totalTimeline > 0 ? Math.round((completedTimeline / totalTimeline) * 100) : 0;

  const bookedVendors = event.vendors.filter(v => v.status === 'booked').length;
  const totalVendors = event.vendors.length;

  const attendingGuests = event.guests.filter(g => g.status === 'attending').reduce((acc, g) => acc + g.partySize, 0);

  // Next upcoming milestone
  const nextMilestone = event.timelineItems.find(t => !t.completed);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 text-white p-6 sm:p-8 shadow-xl">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/30 text-rose-300 border border-rose-500/40">
                {event.eventType} Plan
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-slate-200">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>AI Blueprint Active</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold tracking-tight text-white">
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-rose-400" />
                <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                {event.time && <span>• {event.time}</span>}
              </div>
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>{event.guestCount} Guests Target</span>
              </div>
            </div>
          </div>

          {/* Quick Header CTA buttons */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
            <button
              onClick={onOpenChat}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-sm shadow-lg shadow-rose-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask AI Planner</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm backdrop-blur-sm transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>{shareToast ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={onOpenPrint}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm backdrop-blur-sm transition-all"
              title="Print & PDF Export"
            >
              Print Master Plan
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Budget KPI */}
        <div 
          onClick={() => onNavigateTab('budget')}
          className="cursor-pointer glass-panel p-5 rounded-2xl hover:shadow-glass-hover transition-all border border-slate-200/80 dark:border-slate-800 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Budget Status</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              {event.currency}{totalCommitted.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              of {event.currency}{event.totalBudget.toLocaleString()} Total Target
            </p>
          </div>
          <div className="mt-4">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  budgetSpentPercent > 100 ? 'bg-rose-500' : budgetSpentPercent > 85 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(budgetSpentPercent, 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5 font-medium">
              <span>{budgetSpentPercent}% Committed</span>
              <span className={remainingBudget < 0 ? 'text-rose-500 font-bold' : 'text-emerald-600 font-semibold'}>
                {remainingBudget < 0 ? `Over by ${event.currency}${Math.abs(remainingBudget).toLocaleString()}` : `${event.currency}${remainingBudget.toLocaleString()} left`}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline KPI */}
        <div 
          onClick={() => onNavigateTab('timeline')}
          className="cursor-pointer glass-panel p-5 rounded-2xl hover:shadow-glass-hover transition-all border border-slate-200/80 dark:border-slate-800 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Checklist & Tasks</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              {completedTimeline} / {totalTimeline}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tasks & Milestones Complete
            </p>
          </div>
          <div className="mt-4">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-sky-500 rounded-full transition-all duration-500"
                style={{ width: `${timelinePercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5 font-medium">
              <span>{timelinePercent}% Complete</span>
              <span className="text-sky-600 font-semibold">{totalTimeline - completedTimeline} remaining</span>
            </div>
          </div>
        </div>

        {/* Vendors KPI */}
        <div 
          onClick={() => onNavigateTab('vendors')}
          className="cursor-pointer glass-panel p-5 rounded-2xl hover:shadow-glass-hover transition-all border border-slate-200/80 dark:border-slate-800 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Vendors & Partners</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              {bookedVendors} Booked
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Across {totalVendors} Key Categories
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>Paid Deposits:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {event.currency}{totalPaid.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Guests KPI */}
        <div 
          onClick={() => onNavigateTab('guests')}
          className="cursor-pointer glass-panel p-5 rounded-2xl hover:shadow-glass-hover transition-all border border-slate-200/80 dark:border-slate-800 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">RSVP Attendance</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              {attendingGuests} Confirmed
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Target: {event.guestCount} Attendees
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>Capacity Fill:</span>
            <span className="font-semibold text-amber-600">
              {Math.round((attendingGuests / event.guestCount) * 100)}%
            </span>
          </div>
        </div>

      </div>

      {/* Aesthetic Concept & Color Palette Studio */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-rose-500" />
              <span>AI Aesthetic Concept & Theme Board</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Personalized creative vision, styling directives, and color swatches
            </p>
          </div>

          {event.dressCode && (
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Shirt className="w-3.5 h-3.5 text-rose-500" />
              <span>Dress Code: {event.dressCode}</span>
            </div>
          )}
        </div>

        {/* Theme description */}
        <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
            "{event.themeDescription || event.vibe}"
          </p>
        </div>

        {/* Color Palette Swatches */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Curated 5-Tone Color Harmony (Click to copy HEX)
            </span>
            {copiedHex && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 animate-fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>Copied {copiedHex}!</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {event.colorPalette.map((color, idx) => (
              <button
                key={idx}
                onClick={() => copyToClipboard(color.hex)}
                className="group relative flex flex-col p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:shadow-md transition-all text-left"
              >
                <div 
                  className="w-full h-14 rounded-lg shadow-inner mb-2.5 transition-transform group-hover:scale-98 relative flex items-center justify-center"
                  style={{ backgroundColor: color.hex }}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white rounded p-1">
                    <Copy className="w-3.5 h-3.5" />
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {color.name}
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase">
                  {color.hex}
                </span>
                <span className="text-[10px] text-slate-400 truncate mt-0.5">
                  {color.role}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Upcoming Milestone & Featured Creative Ideas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Next Key Milestone Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Clock className="w-4 h-4 text-sky-500" />
                <span>Next Upcoming Action</span>
              </h3>
              <button 
                onClick={() => onNavigateTab('timeline')}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center space-x-1"
              >
                <span>Full Timeline</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {nextMilestone ? (
              <div className="p-4 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300">
                    {nextMilestone.timeLabel}
                  </span>
                  <span className="text-xs font-medium text-slate-500">{nextMilestone.category}</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  {nextMilestone.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {nextMilestone.description}
                </p>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 text-sm">
                🎉 All current milestones completed! You're ready for the big day.
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Run-of-show total items: {event.timelineItems.length}</span>
            <button
              onClick={() => onNavigateTab('timeline')}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition-colors"
            >
              Open Day-Of Schedule
            </button>
          </div>
        </div>

        {/* Featured Creative Ideas Spotlight */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Personalized Idea Spotlight</span>
              </h3>
              <button 
                onClick={() => onNavigateTab('ideas')}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center space-x-1"
              >
                <span>Idea Studio ({event.ideas.length})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {event.ideas.slice(0, 2).map((idea) => (
                <div 
                  key={idea.id}
                  className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {idea.title}
                    </span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      {idea.category.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {idea.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">Need inspiration for food or entertainment?</span>
            <button
              onClick={() => onNavigateTab('ideas')}
              className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300 font-semibold hover:bg-rose-100 transition-colors"
            >
              Explore All Ideas
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
