import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Wallet, 
  Clock, 
  Building2, 
  Lightbulb, 
  Users, 
  LayoutDashboard,
  BotMessageSquare,
  Plus
} from 'lucide-react';
import { EventPlan, AppSettings } from './types';
import { 
  getStoredEvents, 
  saveStoredEvents, 
  getActiveEventId, 
  saveActiveEventId, 
  getAppSettings, 
  saveAppSettings,
  resetToSeedData 
} from './services/storage';

// Components
import { Navbar } from './components/Navbar';
import { EventOverview } from './components/EventOverview';
import { BudgetTracker } from './components/BudgetTracker';
import { TimelineView } from './components/TimelineView';
import { VendorManager } from './components/VendorManager';
import { IdeaStudio } from './components/IdeaStudio';
import { GuestManager } from './components/GuestManager';
import { AiWizardModal } from './components/AiWizardModal';
import { AiChatDrawer } from './components/AiChatDrawer';
import { PrintExportModal } from './components/PrintExportModal';
import { SettingsModal } from './components/SettingsModal';

type NavTab = 'overview' | 'budget' | 'timeline' | 'vendors' | 'ideas' | 'guests';

export const App: React.FC = () => {
  const [events, setEvents] = useState<EventPlan[]>(() => getStoredEvents());
  const [activeEventId, setActiveEventId] = useState<string>(() => getActiveEventId(events));
  const [settings, setSettings] = useState<AppSettings>(() => getAppSettings());
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return settings.theme === 'dark' || 
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Modal / Drawer open states
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync dark mode class on HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sync events to local storage whenever they change
  useEffect(() => {
    saveStoredEvents(events);
  }, [events]);

  // Sync active event ID
  useEffect(() => {
    saveActiveEventId(activeEventId);
  }, [activeEventId]);

  // Current active event
  const currentEvent = events.find(e => e.id === activeEventId) || events[0];

  const handleSelectEvent = (id: string) => {
    setActiveEventId(id);
  };

  const handleUpdateCurrentEvent = (updated: EventPlan) => {
    const updatedEvents = events.map(e => e.id === updated.id ? updated : e);
    setEvents(updatedEvents);
  };

  const handleEventCreated = (newEvent: EventPlan) => {
    setEvents([newEvent, ...events]);
    setActiveEventId(newEvent.id);
    setActiveTab('overview');
  };

  const handleResetData = () => {
    const resetEvents = resetToSeedData();
    setEvents(resetEvents);
    setActiveEventId(resetEvents[0].id);
    setActiveTab('overview');
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveAppSettings(newSettings);
  };

  const handleToggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    const updated = { ...settings, theme: next ? ('dark' as const) : ('light' as const) };
    setSettings(updated);
    saveAppSettings(updated);
  };

  if (!currentEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        <button
          onClick={handleResetData}
          className="px-6 py-3 rounded-xl bg-rose-600 text-white font-bold"
        >
          Initialize Starter Events
        </button>
      </div>
    );
  }

  const navTabs: { id: NavTab; label: string; icon: any; count?: number }[] = [
    { id: 'overview', label: 'Overview & AI Blueprint', icon: LayoutDashboard },
    { id: 'budget', label: 'Budget & Expenses', icon: Wallet, count: currentEvent.budgetItems.length },
    { id: 'timeline', label: 'Timeline & Run-of-Show', icon: Clock, count: currentEvent.timelineItems.length },
    { id: 'vendors', label: 'Vendors & Checklists', icon: Building2, count: currentEvent.vendors.length },
    { id: 'ideas', label: 'AI Idea Studio', icon: Lightbulb, count: currentEvent.ideas.length },
    { id: 'guests', label: 'Guest & RSVP', icon: Users, count: currentEvent.guests.length },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar
        events={events}
        activeEvent={currentEvent}
        onSelectEvent={handleSelectEvent}
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenPrint={() => setIsPrintOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onResetData={handleResetData}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Main Tab Navigation Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar py-2.5">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-3 sm:px-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/20 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive 
                        ? 'bg-rose-500 text-white' 
                        : 'bg-slate-200/80 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'overview' && (
          <EventOverview
            event={currentEvent}
            onNavigateTab={(tab) => setActiveTab(tab as NavTab)}
            onOpenChat={() => setIsChatOpen(true)}
            onOpenPrint={() => setIsPrintOpen(true)}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetTracker
            event={currentEvent}
            onUpdateEvent={handleUpdateCurrentEvent}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineView
            event={currentEvent}
            onUpdateEvent={handleUpdateCurrentEvent}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}

        {activeTab === 'vendors' && (
          <VendorManager
            event={currentEvent}
            onUpdateEvent={handleUpdateCurrentEvent}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}

        {activeTab === 'ideas' && (
          <IdeaStudio
            event={currentEvent}
            onUpdateEvent={handleUpdateCurrentEvent}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}

        {activeTab === 'guests' && (
          <GuestManager
            event={currentEvent}
            onUpdateEvent={handleUpdateCurrentEvent}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
              CelebrAItion
            </span>
            <span>•</span>
            <span>GenAI Event Planning Suite for Weddings, Birthdays & Community Events</span>
          </div>
          <div>
            Powered by Generative AI with Budgets, Timelines, Vendors & Creative Ideas
          </div>
        </div>
      </footer>

      {/* Floating AI Chat Trigger on Mobile / Tablet */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 p-3.5 rounded-2xl bg-gradient-to-tr from-rose-500 via-amber-500 to-purple-600 text-white shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 group"
      >
        <BotMessageSquare className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline font-bold text-xs">Ask PlanBot</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </button>

      {/* Modals & Drawers */}
      {isWizardOpen && (
        <AiWizardModal
          apiKey={settings.geminiApiKey}
          onClose={() => setIsWizardOpen(false)}
          onEventCreated={handleEventCreated}
        />
      )}

      <AiChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        event={currentEvent}
        apiKey={settings.geminiApiKey}
        onUpdateEvent={handleUpdateCurrentEvent}
      />

      {isPrintOpen && (
        <PrintExportModal
          event={currentEvent}
          onClose={() => setIsPrintOpen(false)}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onSaveSettings={handleSaveSettings}
          onResetData={handleResetData}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

    </div>
  );
};
