import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  Download, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Search,
  Filter,
  DollarSign
} from 'lucide-react';
import { EventPlan, BudgetItem } from '../types';

interface BudgetTrackerProps {
  event: EventPlan;
  onUpdateEvent: (updated: EventPlan) => void;
  onOpenChat: () => void;
}

const CATEGORIES: BudgetItem['category'][] = [
  'Venue & Rentals',
  'Catering & Beverages',
  'Photography & Videography',
  'Decor, Florals & Lighting',
  'Entertainment, Music & AV',
  'Attire, Beauty & Rings',
  'Invitations, Favors & Signage',
  'Permits, Insurance & Logistics',
  'Contingency & Emergency Reserve'
];

export const BudgetTracker: React.FC<BudgetTrackerProps> = ({
  event,
  onUpdateEvent,
  onOpenChat
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<BudgetItem['category']>('Venue & Rentals');
  const [formEstimated, setFormEstimated] = useState<number>(0);
  const [formActual, setFormActual] = useState<number>(0);
  const [formPaid, setFormPaid] = useState<number>(0);
  const [formStatus, setFormStatus] = useState<BudgetItem['status']>('planned');
  const [formPriority, setFormPriority] = useState<BudgetItem['priority']>('essential');
  const [formNotes, setFormNotes] = useState('');

  // Calculations
  const totalCommitted = event.budgetItems.reduce(
    (acc, item) => acc + (item.actualCost > 0 ? item.actualCost : item.estimatedCost), 
    0
  );
  const totalPaid = event.budgetItems.reduce((acc, item) => acc + item.paidAmount, 0);
  const remainingBudget = event.totalBudget - totalCommitted;
  const isOverBudget = remainingBudget < 0;

  // Filtered items
  const filteredItems = event.budgetItems.filter(item => {
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (filterPriority !== 'all' && item.priority !== filterPriority) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const openAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategory('Venue & Rentals');
    setFormEstimated(500);
    setFormActual(0);
    setFormPaid(0);
    setFormStatus('planned');
    setFormPriority('essential');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: BudgetItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormEstimated(item.estimatedCost);
    setFormActual(item.actualCost);
    setFormPaid(item.paidAmount);
    setFormStatus(item.status);
    setFormPriority(item.priority);
    setFormNotes(item.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingItem) {
      const updatedList = event.budgetItems.map(item => 
        item.id === editingItem.id 
          ? {
              ...item,
              name: formName.trim(),
              category: formCategory,
              estimatedCost: Number(formEstimated) || 0,
              actualCost: Number(formActual) || 0,
              paidAmount: Number(formPaid) || 0,
              status: formStatus,
              priority: formPriority,
              notes: formNotes.trim()
            }
          : item
      );
      onUpdateEvent({ ...event, budgetItems: updatedList, updatedAt: new Date().toISOString() });
    } else {
      const newItem: BudgetItem = {
        id: `b-item-${Date.now()}`,
        name: formName.trim(),
        category: formCategory,
        estimatedCost: Number(formEstimated) || 0,
        actualCost: Number(formActual) || 0,
        paidAmount: Number(formPaid) || 0,
        status: formStatus,
        priority: formPriority,
        notes: formNotes.trim()
      };
      onUpdateEvent({ ...event, budgetItems: [...event.budgetItems, newItem], updatedAt: new Date().toISOString() });
    }
    setIsModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Delete this budget item?')) {
      const updatedList = event.budgetItems.filter(item => item.id !== id);
      onUpdateEvent({ ...event, budgetItems: updatedList, updatedAt: new Date().toISOString() });
    }
  };

  const handleQuickMarkPaid = (item: BudgetItem) => {
    const costToUse = item.actualCost > 0 ? item.actualCost : item.estimatedCost;
    const updatedList = event.budgetItems.map(b => 
      b.id === item.id 
        ? { ...b, paidAmount: costToUse, status: 'paid' as const }
        : b
    );
    onUpdateEvent({ ...event, budgetItems: updatedList, updatedAt: new Date().toISOString() });
  };

  const exportCsv = () => {
    const headers = ['Category', 'Item Name', 'Priority', 'Status', 'Estimated Cost', 'Actual Cost', 'Paid Amount', 'Notes'];
    const rows = event.budgetItems.map(b => [
      `"${b.category}"`,
      `"${b.name.replace(/"/g, '""')}"`,
      b.priority,
      b.status,
      b.estimatedCost,
      b.actualCost,
      b.paidAmount,
      `"${(b.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}_Budget.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Grouped expenses by category for breakdown bars
  const categoryTotals = CATEGORIES.map(cat => {
    const items = event.budgetItems.filter(b => b.category === cat);
    const total = items.reduce((sum, i) => sum + (i.actualCost > 0 ? i.actualCost : i.estimatedCost), 0);
    return { category: cat, total, count: items.length };
  }).filter(c => c.total > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <Wallet className="w-6 h-6 text-rose-500" />
            <span>Budget & Expense Tracker</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time cost allocation, vendor deposit tracking, and AI budget optimization
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenChat}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>Ask AI to Trim Budget</span>
          </button>
          <button
            onClick={exportCsv}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-md shadow-rose-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Target Budget</span>
          <div className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-1.5">
            {event.currency}{event.totalBudget.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Full ceiling allocation</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Committed / Est.</span>
          <div className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-1.5">
            {event.currency}{totalCommitted.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {Math.round((totalCommitted / event.totalBudget) * 100)}% of total budget
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Actual Paid to Date</span>
          <div className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400 mt-1.5">
            {event.currency}{totalPaid.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Deposits and paid invoices</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Remaining Buffer</span>
          <div className={`text-2xl font-bold font-display mt-1.5 ${isOverBudget ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
            {isOverBudget ? `-${event.currency}${Math.abs(remainingBudget).toLocaleString()}` : `${event.currency}${remainingBudget.toLocaleString()}`}
          </div>
          <span className={`text-[11px] mt-1 block font-medium ${isOverBudget ? 'text-rose-500' : 'text-emerald-600'}`}>
            {isOverBudget ? '⚠️ Over budget ceiling' : '✅ Under budget cushion'}
          </span>
        </div>

      </div>

      {/* Category Cost Distribution Bars */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Category Breakdown Distribution
          </h3>
          <span className="text-xs text-slate-500">
            {categoryTotals.length} Active Categories
          </span>
        </div>

        <div className="space-y-2.5">
          {categoryTotals.map(cat => {
            const pct = Math.round((cat.total / (totalCommitted || 1)) * 100);
            return (
              <div key={cat.category} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {cat.category} <span className="text-slate-400">({cat.count} items)</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {event.currency}{cat.total.toLocaleString()} <span className="text-slate-400 font-normal">({pct}%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search expense item..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="essential">Essential</option>
            <option value="recommended">Recommended</option>
            <option value="optional">Optional</option>
          </select>
        </div>

      </div>

      {/* Expense Items Table */}
      <div className="glass-panel rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Item & Category</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Est. Cost</th>
                <th className="py-3 px-3 text-right">Actual Cost</th>
                <th className="py-3 px-3 text-right">Paid</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No budget items match your current filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-slate-400">{item.category}</p>
                      {item.notes && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-1 mt-0.5">
                          "{item.notes}"
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.priority === 'essential' 
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' 
                          : item.priority === 'recommended' 
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' 
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {item.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        item.status === 'paid' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' 
                          : item.status === 'deposit_paid'
                          ? 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono text-slate-600 dark:text-slate-300">
                      {event.currency}{item.estimatedCost.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-medium text-slate-900 dark:text-white">
                      {item.actualCost > 0 ? `${event.currency}${item.actualCost.toLocaleString()}` : '—'}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      {event.currency}{item.paidAmount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        {item.status !== 'paid' && (
                          <button
                            onClick={() => handleQuickMarkPaid(item)}
                            title="Mark as Fully Paid"
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(item)}
                          title="Edit Item"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          title="Delete Item"
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg glass-dropdown p-6 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">
              {editingItem ? 'Edit Expense Item' : 'Add New Expense Item'}
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Vintage String Quartet, Venue Downpayment..."
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  >
                    <option value="essential">Essential</option>
                    <option value="recommended">Recommended</option>
                    <option value="optional">Optional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Estimated ({event.currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formEstimated}
                    onChange={(e) => setFormEstimated(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Actual ({event.currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formActual}
                    onChange={(e) => setFormActual(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Paid ({event.currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formPaid}
                    onChange={(e) => setFormPaid(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                >
                  <option value="planned">Planned (Unpaid)</option>
                  <option value="deposit_paid">Deposit Paid</option>
                  <option value="paid">Fully Paid</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes & Details
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Contract stipulations, due dates, breakdown terms..."
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
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors shadow-sm"
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
