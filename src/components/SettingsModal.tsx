import React, { useState } from 'react';
import { Settings, Key, DollarSign, RotateCcw, X, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { AppSettings, CurrencySymbol } from '../types';

interface SettingsModalProps {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onResetData: () => void;
  onClose: () => void;
}

const CURRENCIES: { symbol: CurrencySymbol; label: string }[] = [
  { symbol: '$', label: '$ (USD / AUD / CAD)' },
  { symbol: '€', label: '€ (EUR)' },
  { symbol: '£', label: '£ (GBP)' },
  { symbol: '₹', label: '₹ (INR)' },
  { symbol: 'A$', label: 'A$ (AUD)' },
  { symbol: 'C$', label: 'C$ (CAD)' },
  { symbol: '¥', label: '¥ (JPY / CNY)' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSaveSettings,
  onResetData,
  onClose
}) => {
  const [apiKey, setApiKey] = useState(settings.geminiApiKey || '');
  const [currency, setCurrency] = useState<CurrencySymbol>(settings.preferredCurrency || '$');
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      ...settings,
      geminiApiKey: apiKey.trim(),
      preferredCurrency: currency
    });
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 800);
  };

  const handleReset = () => {
    if (window.confirm('Reset all events and restore the realistic starter demo events? Any unsaved custom events will be replaced.')) {
      onResetData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg glass-dropdown p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                App & AI Settings
              </h3>
              <p className="text-xs text-slate-400">
                Configure GenAI connection, currency, and data
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
          
          {/* Gemini API Key */}
          <div className="space-y-1.5">
            <label className="flex items-center space-x-1.5 font-bold text-slate-700 dark:text-slate-300">
              <Key className="w-4 h-4 text-rose-500" />
              <span>Gemini API Key (Optional)</span>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-start space-x-2 text-[11px] text-slate-500 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Zero-Config Mode:</strong> If left empty, CelebrAItion runs seamlessly using its built-in intelligent contextual Generative Engine. Entering a Google Gemini API Key connects to live Gemini 1.5/2.0 Flash models directly from your browser!
              </span>
            </div>
          </div>

          {/* Preferred Currency */}
          <div className="space-y-1.5">
            <label className="flex items-center space-x-1.5 font-bold text-slate-700 dark:text-slate-300">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>Preferred Default Currency</span>
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencySymbol)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium focus:outline-none"
            >
              {CURRENCIES.map(c => (
                <option key={c.symbol} value={c.symbol}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Danger Zone: Reset seed data */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Sample Data Management
            </span>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                  Restore Starter Events
                </p>
                <p className="text-[11px] text-slate-400">
                  Resets to wedding, birthday & community starter events
                </p>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Data</span>
              </button>
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors shadow-sm"
            >
              {savedToast ? <Check className="w-4 h-4" /> : null}
              <span>{savedToast ? 'Saved!' : 'Save Settings'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
