import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Mail, 
  Phone, 
  Globe, 
  Sparkles, 
  CheckCircle, 
  HelpCircle, 
  Edit3, 
  Trash2, 
  Star,
  ChevronDown,
  ChevronUp,
  Send
} from 'lucide-react';
import { EventPlan, VendorItem, VendorStatus } from '../types';
import { VendorInquiryModal } from './VendorInquiryModal';

interface VendorManagerProps {
  event: EventPlan;
  onUpdateEvent: (updated: EventPlan) => void;
  onOpenChat: () => void;
}

const VENDOR_CATEGORIES: VendorItem['category'][] = [
  'Venue',
  'Catering & Bar',
  'Photography',
  'Videography',
  'Florist & Decor',
  'DJ & Live Band',
  'Cake & Desserts',
  'Rentals & Furniture',
  'Invitations & Paper',
  'Security & Permits',
  'Transportation'
];

export const VendorManager: React.FC<VendorManagerProps> = ({
  event,
  onUpdateEvent,
  onOpenChat
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedVendorId, setExpandedVendorId] = useState<string | null>(null);

  // Inquiry modal state
  const [inquiryVendor, setInquiryVendor] = useState<VendorItem | null>(null);

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<VendorItem | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<VendorItem['category']>('Venue');
  const [formContactPerson, setFormContactPerson] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formWebsite, setFormWebsite] = useState('');
  const [formQuote, setFormQuote] = useState<number>(0);
  const [formDeposit, setFormDeposit] = useState<number>(0);
  const [formStatus, setFormStatus] = useState<VendorStatus>('researching');
  const [formRating, setFormRating] = useState<number>(5);
  const [formNotes, setFormNotes] = useState('');
  const [formQuestions, setFormQuestions] = useState<string>('');

  const toggleExpand = (id: string) => {
    setExpandedVendorId(expandedVendorId === id ? null : id);
  };

  const openAddModal = () => {
    setEditingVendor(null);
    setFormName('');
    setFormCategory('Venue');
    setFormContactPerson('');
    setFormEmail('');
    setFormPhone('');
    setFormWebsite('');
    setFormQuote(0);
    setFormDeposit(0);
    setFormStatus('researching');
    setFormRating(5);
    setFormNotes('');
    setFormQuestions(
      'What is your cancellation and refund policy?\nAre there any overtime or extra travel fees?\nDo you carry comprehensive commercial liability insurance?'
    );
    setIsModalOpen(true);
  };

  const openEditModal = (vendor: VendorItem) => {
    setEditingVendor(vendor);
    setFormName(vendor.name);
    setFormCategory(vendor.category);
    setFormContactPerson(vendor.contactPerson || '');
    setFormEmail(vendor.email || '');
    setFormPhone(vendor.phone || '');
    setFormWebsite(vendor.website || '');
    setFormQuote(vendor.quoteAmount || 0);
    setFormDeposit(vendor.depositPaid || 0);
    setFormStatus(vendor.status);
    setFormRating(vendor.rating || 5);
    setFormNotes(vendor.notes || '');
    setFormQuestions(vendor.keyQuestionsToAsk.join('\n'));
    setIsModalOpen(true);
  };

  const handleSaveVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const questionsArray = formQuestions
      .split('\n')
      .map(q => q.trim())
      .filter(q => q.length > 0);

    if (editingVendor) {
      const updatedList = event.vendors.map(v => 
        v.id === editingVendor.id 
          ? {
              ...v,
              name: formName.trim(),
              category: formCategory,
              contactPerson: formContactPerson.trim(),
              email: formEmail.trim(),
              phone: formPhone.trim(),
              website: formWebsite.trim(),
              quoteAmount: Number(formQuote) || 0,
              depositPaid: Number(formDeposit) || 0,
              status: formStatus,
              rating: formRating,
              notes: formNotes.trim(),
              keyQuestionsToAsk: questionsArray
            }
          : v
      );
      onUpdateEvent({ ...event, vendors: updatedList, updatedAt: new Date().toISOString() });
    } else {
      const newVendor: VendorItem = {
        id: `v-vendor-${Date.now()}`,
        name: formName.trim(),
        category: formCategory,
        contactPerson: formContactPerson.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        website: formWebsite.trim(),
        quoteAmount: Number(formQuote) || 0,
        depositPaid: Number(formDeposit) || 0,
        status: formStatus,
        rating: formRating,
        notes: formNotes.trim(),
        keyQuestionsToAsk: questionsArray.length > 0 ? questionsArray : [
          'What is your cancellation and deposit policy?',
          'What is included in the package vs extra charge?'
        ]
      };
      onUpdateEvent({ ...event, vendors: [...event.vendors, newVendor], updatedAt: new Date().toISOString() });
    }
    setIsModalOpen(false);
  };

  const handleDeleteVendor = (id: string) => {
    if (window.confirm('Delete this vendor?')) {
      const updatedList = event.vendors.filter(v => v.id !== id);
      onUpdateEvent({ ...event, vendors: updatedList, updatedAt: new Date().toISOString() });
    }
  };

  const handleQuickStatusChange = (vendor: VendorItem, nextStatus: VendorStatus) => {
    const updatedList = event.vendors.map(v => 
      v.id === vendor.id ? { ...v, status: nextStatus } : v
    );
    onUpdateEvent({ ...event, vendors: updatedList, updatedAt: new Date().toISOString() });
  };

  // Filter vendors
  const filteredVendors = event.vendors.filter(v => {
    if (filterCategory !== 'all' && v.category !== filterCategory) return false;
    if (filterStatus !== 'all' && v.status !== filterStatus) return false;
    return true;
  });

  const bookedCount = event.vendors.filter(v => v.status === 'booked').length;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-purple-500" />
            <span>Vendors & Partner Checklists</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Compare quotes, track contract statuses, and generate AI vendor outreach emails
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenChat}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Draft RFP / Ask AI</span>
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 shadow-md shadow-purple-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vendor</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Vendors ({filteredVendors.length} / {event.vendors.length}) • {bookedCount} Booked
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {VENDOR_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="researching">Researching</option>
            <option value="contacted">Contacted</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="booked">Booked</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredVendors.length === 0 ? (
          <div className="col-span-full glass-panel p-10 rounded-2xl text-center text-slate-400">
            <Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No vendors found matching your filter.</p>
          </div>
        ) : (
          filteredVendors.map((vendor) => {
            const isExpanded = expandedVendorId === vendor.id;
            return (
              <div 
                key={vendor.id}
                className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:shadow-glass-hover transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                        {vendor.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                        {vendor.name}
                      </h3>
                      {vendor.contactPerson && (
                        <p className="text-xs text-slate-500">Contact: {vendor.contactPerson}</p>
                      )}
                    </div>

                    {/* Status Pill Switcher */}
                    <select
                      value={vendor.status}
                      onChange={(e) => handleQuickStatusChange(vendor, e.target.value as VendorStatus)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-xl border focus:outline-none transition-colors ${
                        vendor.status === 'booked' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800' 
                          : vendor.status === 'shortlisted'
                          ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                          : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                      }`}
                    >
                      <option value="researching">Researching</option>
                      <option value="contacted">Contacted</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="booked">Booked</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>

                  {/* Contact Row */}
                  <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-slate-600 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    {vendor.email && (
                      <a href={`mailto:${vendor.email}`} className="flex items-center space-x-1 hover:text-purple-600 transition-colors">
                        <Mail className="w-3.5 h-3.5 text-purple-500" />
                        <span className="truncate max-w-[140px]">{vendor.email}</span>
                      </a>
                    )}
                    {vendor.phone && (
                      <a href={`tel:${vendor.phone}`} className="flex items-center space-x-1 hover:text-purple-600 transition-colors">
                        <Phone className="w-3.5 h-3.5 text-purple-500" />
                        <span>{vendor.phone}</span>
                      </a>
                    )}
                    {vendor.website && (
                      <a href={vendor.website} target="_blank" rel="noreferrer" className="flex items-center space-x-1 hover:text-purple-600 transition-colors">
                        <Globe className="w-3.5 h-3.5 text-purple-500" />
                        <span>Portfolio</span>
                      </a>
                    )}
                  </div>

                  {/* Financials & Notes */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Quote Amount</span>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {vendor.quoteAmount ? `${event.currency}${vendor.quoteAmount.toLocaleString()}` : 'Pending Quote'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Deposit Paid</span>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">
                        {vendor.depositPaid ? `${event.currency}${vendor.depositPaid.toLocaleString()}` : `${event.currency}0`}
                      </p>
                    </div>
                  </div>

                  {vendor.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic mt-2">
                      "{vendor.notes}"
                    </p>
                  )}

                  {/* Collapsible Key Questions to Ask Checklist */}
                  {vendor.keyQuestionsToAsk && vendor.keyQuestionsToAsk.length > 0 && (
                    <div className="mt-3">
                      <button
                        onClick={() => toggleExpand(vendor.id)}
                        className="flex items-center justify-between w-full text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        <span className="flex items-center space-x-1">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>AI Vetting Questions ({vendor.keyQuestionsToAsk.length})</span>
                        </span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-2 p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-1.5 animate-fade-in text-xs">
                          {vendor.keyQuestionsToAsk.map((q, idx) => (
                            <div key={idx} className="flex items-start space-x-2 text-slate-700 dark:text-slate-300">
                              <span className="text-purple-500 font-bold">•</span>
                              <span className="leading-snug">{q}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Card Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setInquiryVendor(vendor)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>Generate AI Outreach Email</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(vendor)}
                      title="Edit Vendor"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteVendor(vendor.id)}
                      title="Delete Vendor"
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Vendor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg glass-dropdown p-6 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">
              {editingVendor ? 'Edit Vendor Details' : 'Add New Vendor'}
            </h3>

            <form onSubmit={handleSaveVendor} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Vendor / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Whispering Pines Floral Co."
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  >
                    {VENDOR_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={formContactPerson}
                    onChange={(e) => setFormContactPerson(e.target.value)}
                    placeholder="Elena Rostova"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="contact@vendor.com"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Quote ({event.currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formQuote}
                    onChange={(e) => setFormQuote(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Deposit Paid ({event.currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formDeposit}
                    onChange={(e) => setFormDeposit(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  >
                    <option value="researching">Researching</option>
                    <option value="contacted">Contacted</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="booked">Booked</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Key Vetting Questions to Ask (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formQuestions}
                  onChange={(e) => setFormQuestions(e.target.value)}
                  placeholder="What is your deposit deadline?&#10;What is the backup plan in case of equipment failure?"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Internal Notes & Contract Details
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Special stipulations, equipment included, arrival times..."
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
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors shadow-sm"
                >
                  {editingVendor ? 'Save Changes' : 'Add Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vendor Inquiry Modal */}
      {inquiryVendor && (
        <VendorInquiryModal
          vendor={inquiryVendor}
          event={event}
          onClose={() => setInquiryVendor(null)}
        />
      )}

    </div>
  );
};
