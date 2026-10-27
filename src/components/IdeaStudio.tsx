import React, { useState } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  Bookmark, 
  Plus, 
  Trash2, 
  Check, 
  Filter, 
  DollarSign, 
  Gauge, 
  Tag,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventPlan, IdeaItem } from '../types';
import { generateMoreIdeas } from '../services/aiEngine';

interface IdeaStudioProps {
  event: EventPlan;
  onUpdateEvent: (updated: EventPlan) => void;
  onOpenChat: () => void;
}

const CATEGORIES: IdeaItem['category'][] = [
  'theme',
  'decor',
  'food_drinks',
  'entertainment',
  'favors',
  'interactive',
  'sustainability'
];

export const IdeaStudio: React.FC<IdeaStudioProps> = ({
  event,
  onUpdateEvent,
  onOpenChat
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Custom idea modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<IdeaItem['category']>('interactive');
  const [formDescription, setFormDescription] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formCost, setFormCost] = useState<IdeaItem['costImpact']>('low');
  const [formDifficulty, setFormDifficulty] = useState<IdeaItem['difficulty']>('easy');

  const toggleBookmark = (ideaId: string) => {
    const updated = event.ideas.map(i => 
      i.id === ideaId ? { ...i, bookmarked: !i.bookmarked } : i
    );
    onUpdateEvent({ ...event, ideas: updated, updatedAt: new Date().toISOString() });
  };

  const handleDeleteIdea = (ideaId: string) => {
    const updated = event.ideas.filter(i => i.id !== ideaId);
    onUpdateEvent({ ...event, ideas: updated, updatedAt: new Date().toISOString() });
  };

  const handleGenerateMore = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Smooth AI feel
      const extraCategory = filterCategory === 'all' ? 'interactive' : filterCategory;
      const newIdeas = generateMoreIdeas(extraCategory, event);

      // Append non-duplicate ideas
      const updatedList = [...event.ideas, ...newIdeas];
      onUpdateEvent({ ...event, ideas: updatedList, updatedAt: new Date().toISOString() });

      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveCustomIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const tagsArray = formTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newIdea: IdeaItem = {
      id: `idea-custom-${Date.now()}`,
      title: formTitle.trim(),
      category: formCategory,
      description: formDescription.trim(),
      tags: tagsArray.length > 0 ? tagsArray : ['Custom Idea'],
      costImpact: formCost,
      difficulty: formDifficulty,
      bookmarked: true,
      aiSuggestedReason: `Created for "${event.title}"`
    };

    onUpdateEvent({ ...event, ideas: [newIdea, ...event.ideas], updatedAt: new Date().toISOString() });
    setIsModalOpen(false);
  };

  const handleAddIdeaToBudget = (idea: IdeaItem) => {
    const defaultCost = idea.costImpact === 'low' ? 150 : idea.costImpact === 'medium' ? 450 : 1200;
    const newBudgetItem = {
      id: `b-from-idea-${Date.now()}`,
      category: 'Decor, Florals & Lighting' as const,
      name: idea.title,
      estimatedCost: defaultCost,
      actualCost: 0,
      paidAmount: 0,
      status: 'planned' as const,
      priority: 'recommended' as const,
      notes: `Added from AI Idea Studio: ${idea.description}`
    };

    onUpdateEvent({
      ...event,
      budgetItems: [...event.budgetItems, newBudgetItem],
      updatedAt: new Date().toISOString()
    });
    alert(`Added "${idea.title}" to your Budget tracker!`);
  };

  // Filter ideas
  const filteredIdeas = event.ideas.filter(idea => {
    if (filterCategory !== 'all' && idea.category !== filterCategory) return false;
    if (onlyBookmarked && !idea.bookmarked) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <Lightbulb className="w-6 h-6 text-amber-500" />
            <span>AI Idea & Concept Studio</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Bespoke decor concepts, interactive guest experiences, signature cocktails, and memorable favors
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleGenerateMore}
            disabled={isGenerating}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'AI Brainstorming...' : 'Generate More Ideas with AI'}</span>
          </button>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Idea</span>
          </button>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="glass-panel p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              filterCategory === 'all'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Categories ({event.ideas.length})
          </button>

          {CATEGORIES.map(cat => {
            const count = event.ideas.filter(i => i.category === cat).length;
            if (count === 0 && filterCategory !== cat) return null;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all ${
                  filterCategory === cat
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat.replace('_', ' ')} ({count})
              </button>
            );
          })}
        </div>

        <label className="flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium cursor-pointer px-2">
          <input
            type="checkbox"
            checked={onlyBookmarked}
            onChange={(e) => setOnlyBookmarked(e.target.checked)}
            className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
          />
          <span>Favorites Only ({event.ideas.filter(i => i.bookmarked).length})</span>
        </label>
      </div>

      {/* Ideas Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredIdeas.length === 0 ? (
          <div className="col-span-full glass-panel p-12 rounded-2xl text-center text-slate-400">
            <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50 text-amber-500" />
            <p className="text-sm font-medium">No ideas match this category.</p>
            <button
              onClick={handleGenerateMore}
              className="mt-3 inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-amber-50 text-amber-700 text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Brainstorm with AI now</span>
            </button>
          </div>
        ) : (
          filteredIdeas.map((idea) => (
            <div
              key={idea.id}
              className={`glass-panel p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 hover:shadow-glass-hover ${
                idea.bookmarked 
                  ? 'border-amber-300/80 dark:border-amber-800/80 bg-gradient-to-b from-amber-50/20 to-transparent' 
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                    {idea.category.replace('_', ' ')}
                  </span>

                  <button
                    onClick={() => toggleBookmark(idea.id)}
                    title={idea.bookmarked ? 'Remove from favorites' : 'Save to favorites'}
                    className={`p-1.5 rounded-lg transition-colors ${
                      idea.bookmarked 
                        ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' 
                        : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${idea.bookmarked ? 'fill-amber-500' : ''}`} />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                  {idea.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {idea.description}
                </p>

                {/* AI Reasoning pill */}
                {idea.aiSuggestedReason && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 italic">
                    <span className="font-semibold text-rose-500 not-italic">AI Curated: </span>
                    {idea.aiSuggestedReason}
                  </div>
                )}

                {/* Tags row */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {idea.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom metadata & Action */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <span className="capitalize">Cost: <strong className="text-slate-700 dark:text-slate-300">{idea.costImpact}</strong></span>
                  <span>•</span>
                  <span className="capitalize">Effort: <strong className="text-slate-700 dark:text-slate-300">{idea.difficulty}</strong></span>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleAddIdeaToBudget(idea)}
                    title="Add estimated expense to Budget"
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 transition-colors"
                  >
                    + Add to Budget
                  </button>
                  <button
                    onClick={() => handleDeleteIdea(idea.id)}
                    title="Dismiss Idea"
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Custom Idea Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg glass-dropdown p-6 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">
              Add Custom Creative Idea
            </h3>

            <form onSubmit={handleSaveCustomIdea} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Idea Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. S'mores Roasting Firepit Station, Vinyl Listening Lounge..."
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cost Impact
                  </label>
                  <select
                    value={formCost}
                    onChange={(e) => setFormCost(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  >
                    <option value="low">Low Cost</option>
                    <option value="medium">Medium Cost</option>
                    <option value="high">High Cost</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  >
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="involved">Involved</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description & Execution Notes
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="How will this work, where will it be set up, and what is needed..."
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="Atmosphere, Outdoor, Sweet, Keepsake..."
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
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
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors shadow-sm"
                >
                  Save Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
