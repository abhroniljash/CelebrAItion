import React, { useState } from 'react';
import { Mail, Copy, Check, ExternalLink, Sparkles, X } from 'lucide-react';
import { VendorItem, EventPlan } from '../types';

interface VendorInquiryModalProps {
  vendor: VendorItem;
  event: EventPlan;
  onClose: () => void;
}

export const VendorInquiryModal: React.FC<VendorInquiryModalProps> = ({
  vendor,
  event,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  // Pre-generate professional inquiry message tailored to vendor and event
  const subject = `Inquiry: ${event.eventType.toUpperCase()} on ${event.date} - ${event.title}`;
  const body = `Dear ${vendor.contactPerson || vendor.name + ' Team'},

I hope this email finds you well!

We are currently planning our ${event.eventType}, "${event.title}", set to take place on ${event.date} in ${event.location || '[Venue Location]'}. We have been reviewing your portfolio and are impressed with your work in ${vendor.category}.

Here are key details regarding our event:
• Date: ${event.date}${event.time ? ` at ${event.time}` : ''}
• Location: ${event.location}
• Expected Headcount: ~${event.guestCount} guests
• Theme & Aesthetic: ${event.vibe}
• Estimated Budget Allocation for ${vendor.category}: ~${event.currency}${(vendor.quoteAmount || Math.round(event.totalBudget * 0.15)).toLocaleString()}

Could you please confirm if you currently have availability for our date? If so, we would love to review your latest pricing guide, available packages, and standard contract terms.

Additionally, we'd appreciate if you could answer a couple quick questions:
${vendor.keyQuestionsToAsk.slice(0, 3).map((q, idx) => `  ${idx + 1}. ${q}`).join('\n')}

Looking forward to hearing from you and potentially collaborating!

Warm regards,
[Your Name]
[Your Phone Number]
[Your City/State]`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mailtoLink = vendor.email 
    ? `mailto:${vendor.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` 
    : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl glass-dropdown p-6 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                AI Vendor Outreach Draft
              </h3>
              <p className="text-xs text-slate-400">
                To: {vendor.name} ({vendor.category})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subject Line */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Subject Line
          </label>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200">
            {subject}
          </div>
        </div>

        {/* Email Body */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Generated Email Body
          </label>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-sans text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line max-h-64 overflow-y-auto leading-relaxed">
            {body}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-400">
            {vendor.email ? `Recipient: ${vendor.email}` : 'Add vendor email to open direct email client'}
          </span>

          <div className="flex items-center space-x-2">
            {mailtoLink && (
              <a
                href={mailtoLink}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Mail App</span>
              </a>
            )}

            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Draft'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
