import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Star, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Filter,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventPlan, TimelineItem, TimelinePhase } from '../types';

interface TimelineViewProps {
  event: EventPlan;
  onUpdateEvent: (updated: EventPlan) => void;
  onOpenChat: () => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  event,
  onUpdateEvent,
  onOpenChat
}) => {
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<'all' | 'milestones' | 'day_of'>('all');
  const [showOnlyIncomplete, setShowOnlyIncomplete] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);

  // Form state
  const [formTimeLabel, setFormTimeLabel] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('General');
  const [formPhase, setFormPhase] = useState<TimelinePhase>('day_of');
  const [formIsMilestone, setFormIsMilestone] = useState(false);

  const toggleComplete = (item: TimelineItem) => {
    const nextCompleted = !item.completed;
    if (nextCompleted) {
      // Trigger subtle celebration confetti
      try {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.8 }
        });
      } catch {}
    }

    const updatedList = event.timelineItems.map(t => 
      t.id === item.id ? { ...t, completed: nextCompleted } : t
    );
    onUpdateEvent({ ...event, timelineItems: updatedList, updatedAt: new Date().toISOString() });
  };

  const openAddModal = (presetPhase?: TimelinePhase) => {
    setEditingItem(null);
    setFormTimeLabel(presetPhase === 'day_of' ? '14:00 PM' : '3 Months Out');
    setFormTitle('');
    setFormDescription('');
    setFormCategory('General');
    setFormPhase(presetPhase || (selectedPhaseFilter === 'day_of' ? 'day_of' : 'planning_mid'));
    setFormIsMilestone(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item: TimelineItem) => {
    setEditingItem(item);
    setFormTimeLabel(item.timeLabel);
    setFormTitle(item.title);
    setFormDescription(item.description);
    setFormCategory(item.category);
    setFormPhase(item.phase);
    setFormIsMilestone(!!item.isKeyMilestone);
    setIsModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingItem) {
      const updatedList = event.timelineItems.map(t => 
        t.id === editingItem.id 
          ? {
              ...t,
              timeLabel: formTimeLabel.trim(),
              title: formTitle.trim(),
              description: formDescription.trim(),
              category: formCategory.trim() || 'General',
              phase: formPhase,
              isKeyMilestone: formIsMilestone
            }
          : t
      );
      onUpdateEvent({ ...event, timelineItems: updatedList, updatedAt: new Date().toISOString() });
    } else {
      const newItem: TimelineItem = {
        id: `t-item-${Date.now()}`,
        timeLabel: formTimeLabel.trim(),
        title: formTitle.trim(),
        description: formDescription.trim(),
        category: formCategory.trim() || 'General',
        phase: formPhase,
        completed: false,
        isKeyMilestone: formIsMilestone
      };
      onUpdateEvent({ ...event, timelineItems: [...event.timelineItems, newItem], updatedAt: new Date().toISOString() });
    }
    setIsModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Delete this timeline item?')) {
      const updatedList = event.timelineItems.filter(t => t.id !== id);
      onUpdateEvent({ ...event, timelineItems: updatedList, updatedAt: new Date().toISOString() });
    }
  };

  // Filter items
  const filteredItems = event.timelineItems.filter(item => {
    if (selectedPhaseFilter === 'day_of' && item.phase !== 'day_of') return false;
    if (selectedPhaseFilter === 'milestones' && item.phase === 'day_of') return false;
    if (showOnlyIncomplete && item.completed) return false;
    return true;
  });

  const completedCount = event.timelineItems.filter(t => t.completed).length;
  const dayOfCount = event.timelineItems.filter(t => t.phase === 'day_of').length;
  const roadmapCount = event.timelineItems.filter(t => t.phase !== 'day_of').length;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <Clock className="w-6 h-6 text-sky-500" />
            <span>Timeline & Day-Of Run-of-Show</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Milestone roadmap countdown and minute-by-minute day-of itinerary
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenChat}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200 dark:border-sky-800 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>AI Schedule Check</span>
          </button>
          <button
            onClick={() => openAddModal()}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 shadow-md shadow-sky-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event Slot</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1.5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setSelectedPhaseFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedPhaseFilter === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Timeline ({event.timelineItems.length})
          </button>

          <button
            onClick={() => setSelectedPhaseFilter('milestones')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedPhaseFilter === 'milestones'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Planning Roadmap ({roadmapCount})
          </button>

          <button
            onClick={() => setSelectedPhaseFilter('day_of')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedPhaseFilter === 'day_of'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Day-Of Schedule ({dayOfCount})
          </button>
        </div>

        <label className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer px-3 py-1">
          <input
            type="checkbox"
            checked={showOnlyIncomplete}
            onChange={(e) => setShowOnlyIncomplete(e.target.checked)}
            className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
          />
          <span>Show Pending Only</span>
        </label>
      </div>

      {/* Timeline Stream */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        {filteredItems.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No items found for this filter view.</p>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className={`relative group transition-all ${
                  item.completed ? 'opacity-65' : ''
                }`}
              >
                {/* Node circle on timeline line */}
                <button
                  onClick={() => toggleComplete(item)}
                  className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    item.completed 
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' 
                      : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 text-transparent hover:border-emerald-500'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>

                {/* Content Card */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/40">
                        {item.timeLabel}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {item.category}
                      </span>
                      {item.isKeyMilestone && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>Key Milestone</span>
                        </span>
                      )}
                      {item.phase === 'day_of' && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                          Day-Of Run-of-Show
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(item)}
                        title="Edit Slot"
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        title="Delete Slot"
                        className="p-1 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className={`text-base font-bold text-slate-900 dark:text-white mt-1.5 ${
                    item.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                  }`}>
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Timeline Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg glass-dropdown p-6 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">
              {editingItem ? 'Edit Timeline Slot' : 'Add New Timeline Slot'}
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phase
                  </label>
                  <select
                    value={formPhase}
                    onChange={(e) => setFormPhase(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  >
                    <option value="planning_early">Early Planning (6-12 Months)</option>
                    <option value="planning_mid">Mid Planning (2-6 Months)</option>
                    <option value="planning_late">Late Planning (2-4 Weeks)</option>
                    <option value="week_of">Week of Event</option>
                    <option value="day_of">Day-Of (Hourly Run-of-Show)</option>
                    <option value="post_event">Post Event (Wrap-Up)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Time / Date Label *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTimeLabel}
                    onChange={(e) => setFormTimeLabel(e.target.value)}
                    placeholder="e.g. 14:30 PM, 6 Months Out, Day Before..."
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Title / Action *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Ceremony Commences, Grand Entrance, Submit Permits..."
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category Tag
                </label>
                <input
                  type="text"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="e.g. Ceremony, Photography, Catering, Music, Logistics..."
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description & Logistics Details
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Who is responsible, specific cues, equipment needed..."
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isKeyMilestone"
                  checked={formIsMilestone}
                  onChange={(e) => setFormIsMilestone(e.target.checked)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="isKeyMilestone" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Highlight as a Key Milestone (Priority badge & star)
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold transition-colors shadow-sm"
                >
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
