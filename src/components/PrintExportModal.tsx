import React from 'react';
import { Printer, Download, X, Calendar, MapPin, Users, Wallet, Sparkles } from 'lucide-react';
import { EventPlan } from '../types';

interface PrintExportModalProps {
  event: EventPlan;
  onClose: () => void;
}

export const PrintExportModal: React.FC<PrintExportModalProps> = ({
  event,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(event, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${event.title.replace(/\s+/g, '_')}_Master_Plan.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const totalCommitted = event.budgetItems.reduce(
    (acc, item) => acc + (item.actualCost > 0 ? item.actualCost : item.estimatedCost), 
    0
  );
  const totalPaid = event.budgetItems.reduce((acc, item) => acc + item.paidAmount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden my-auto">
        
        {/* Modal Top Control Bar (Hidden when printing) */}
        <div className="no-print p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-rose-500" />
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">
              Master Event Plan — Print & Export
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadJson}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print to PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 text-xs sm:text-sm">
          
          {/* Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="uppercase text-[11px] font-extrabold tracking-widest text-rose-600">
                CelebrAItion Master Plan • {event.eventType.toUpperCase()}
              </span>
              <span className="text-[11px] text-slate-400">
                Generated: {new Date().toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
              {event.title}
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs text-slate-600 dark:text-slate-300">
              <div>
                <strong>Date:</strong> {event.date} {event.time ? `(${event.time})` : ''}
              </div>
              <div>
                <strong>Location:</strong> {event.location}
              </div>
              <div>
                <strong>Guest Count:</strong> {event.guestCount} Target
              </div>
              <div>
                <strong>Total Budget:</strong> {event.currency}{event.totalBudget.toLocaleString()}
              </div>
            </div>

            {event.vibe && (
              <p className="text-xs text-slate-600 dark:text-slate-400 italic pt-1">
                <strong>Vibe & Vision:</strong> "{event.themeDescription || event.vibe}"
              </p>
            )}
          </div>

          {/* Color Palette */}
          <div className="space-y-2 page-break-inside-avoid">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Aesthetic Color Harmony
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {event.colorPalette.map((c, i) => (
                <div key={i} className="p-2 border rounded-xl text-center">
                  <div className="h-6 w-full rounded-md mb-1 shadow-inner" style={{ backgroundColor: c.hex }} />
                  <span className="text-[10px] font-bold block">{c.name}</span>
                  <span className="text-[9px] font-mono text-slate-400">{c.hex}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Summary & Table */}
          <div className="space-y-3 page-break-inside-avoid">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Budget & Expense Allocation
              </h3>
              <span className="text-xs font-semibold">
                Committed: {event.currency}{totalCommitted.toLocaleString()} / Paid: {event.currency}{totalPaid.toLocaleString()}
              </span>
            </div>

            <table className="w-full text-left border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <tr>
                  <th className="py-2 px-3">Item & Category</th>
                  <th className="py-2 px-2">Priority</th>
                  <th className="py-2 px-2">Status</th>
                  <th className="py-2 px-3 text-right">Est. Cost</th>
                  <th className="py-2 px-3 text-right">Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {event.budgetItems.map(b => (
                  <tr key={b.id}>
                    <td className="py-2 px-3">
                      <strong>{b.name}</strong> <span className="text-slate-400">({b.category})</span>
                    </td>
                    <td className="py-2 px-2 capitalize">{b.priority}</td>
                    <td className="py-2 px-2 capitalize">{b.status.replace('_', ' ')}</td>
                    <td className="py-2 px-3 text-right font-mono">{event.currency}{b.estimatedCost.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-mono">{event.currency}{b.paidAmount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Timeline & Day-Of Run-of-Show */}
          <div className="space-y-3 page-break-inside-avoid">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Day-Of Run-of-Show & Milestone Schedule
            </h3>

            <div className="space-y-2">
              {event.timelineItems.map(t => (
                <div key={t.id} className="p-2.5 border rounded-xl flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 dark:bg-slate-800">
                        {t.timeLabel}
                      </span>
                      <strong className="text-xs">{t.title}</strong>
                      <span className="text-[10px] text-slate-400">({t.category})</span>
                    </div>
                    {t.description && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{t.description}</p>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold uppercase shrink-0 ${t.completed ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {t.completed ? '✓ Completed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Vendors */}
          <div className="space-y-3 page-break-inside-avoid">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Vendor Directory
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {event.vendors.map(v => (
                <div key={v.id} className="p-3 border rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <strong>{v.name}</strong>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                      {v.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{v.category} • Contact: {v.contactPerson || 'General'}</p>
                  {(v.email || v.phone) && (
                    <p className="text-[11px] text-slate-500">{v.email} • {v.phone}</p>
                  )}
                  {v.quoteAmount && (
                    <p className="text-[11px] font-mono font-semibold">
                      Quote: {event.currency}{v.quoteAmount.toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
