import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Download, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Utensils, 
  Trash2, 
  Edit3 
} from 'lucide-react';
import { EventPlan, GuestItem, RsvpStatus } from '../types';

interface GuestManagerProps {
  event: EventPlan;
  onUpdateEvent: (updated: EventPlan) => void;
}

export const GuestManager: React.FC<GuestManagerProps> = ({
  event,
  onUpdateEvent
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<GuestItem | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formPartySize, setFormPartySize] = useState<number>(1);
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formStatus, setFormStatus] = useState<RsvpStatus>('attending');
  const [formGroup, setFormGroup] = useState('');
  const [formTable, setFormTable] = useState('');
  const [formDietary, setFormDietary] = useState('');

  // Headcount statistics
  const attendingCount = event.guests
    .filter(g => g.status === 'attending')
    .reduce((sum, g) => sum + g.partySize, 0);

  const pendingCount = event.guests
    .filter(g => g.status === 'pending')
    .reduce((sum, g) => sum + g.partySize, 0);

  const declinedCount = event.guests
    .filter(g => g.status === 'declined')
    .reduce((sum, g) => sum + g.partySize, 0);

  // Dietary aggregation
  const dietaryList = event.guests
    .filter(g => g.status === 'attending' && g.dietaryRestrictions && g.dietaryRestrictions.toLowerCase() !== 'none')
    .map(g => `${g.name}: ${g.dietaryRestrictions}`);

  const openAddModal = () => {
    setEditingGuest(null);
    setFormName('');
    setFormPartySize(1);
    setFormEmail('');
    setFormPhone('');
    setFormStatus('attending');
    setFormGroup('Friends');
    setFormTable('');
    setFormDietary('None');
    setIsModalOpen(true);
  };

  const openEditModal = (guest: GuestItem) => {
    setEditingGuest(guest);
    setFormName(guest.name);
    setFormPartySize(guest.partySize);
    setFormEmail(guest.email || '');
    setFormPhone(guest.phone || '');
    setFormStatus(guest.status);
    setFormGroup(guest.groupTag || '');
    setFormTable(guest.tableNumber || '');
    setFormDietary(guest.dietaryRestrictions || 'None');
    setIsModalOpen(true);
  };

  const handleSaveGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingGuest) {
      const updated = event.guests.map(g => 
        g.id === editingGuest.id 
          ? {
              ...g,
              name: formName.trim(),
              partySize: Number(formPartySize) || 1,
              email: formEmail.trim(),
              phone: formPhone.trim(),
              status: formStatus,
              groupTag: formGroup.trim(),
              tableNumber: formTable.trim(),
              dietaryRestrictions: formDietary.trim()
            }
          : g
      );
      onUpdateEvent({ ...event, guests: updated, updatedAt: new Date().toISOString() });
    } else {
      const newGuest: GuestItem = {
        id: `guest-${Date.now()}`,
        name: formName.trim(),
        partySize: Number(formPartySize) || 1,
        email: formEmail.trim(),
        phone: formPhone.trim(),
        status: formStatus,
        groupTag: formGroup.trim(),
        tableNumber: formTable.trim(),
        dietaryRestrictions: formDietary.trim()
      };
      onUpdateEvent({ ...event, guests: [...event.guests, newGuest], updatedAt: new Date().toISOString() });
    }
    setIsModalOpen(false);
  };

  const handleDeleteGuest = (id: string) => {
    if (window.confirm('Delete this guest?')) {
      const updated = event.guests.filter(g => g.id !== id);
      onUpdateEvent({ ...event, guests: updated, updatedAt: new Date().toISOString() });
    }
  };

  const handleQuickStatus = (guest: GuestItem, status: RsvpStatus) => {
    const updated = event.guests.map(g => 
      g.id === guest.id ? { ...g, status } : g
    );
    onUpdateEvent({ ...event, guests: updated, updatedAt: new Date().toISOString() });
  };

  const exportGuestCsv = () => {
    const headers = ['Name', 'Party Size', 'RSVP Status', 'Group / Circle', 'Table #', 'Dietary Restrictions', 'Email', 'Phone'];
    const rows = event.guests.map(g => [
      `"${g.name.replace(/"/g, '""')}"`,
      g.partySize,
      g.status,
      `"${(g.groupTag || '').replace(/"/g, '""')}"`,
      `"${(g.tableNumber || '').replace(/"/g, '""')}"`,
      `"${(g.dietaryRestrictions || '').replace(/"/g, '""')}"`,
      `"${(g.email || '').replace(/"/g, '""')}"`,
      `"${(g.phone || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}_Guests.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered guests
  const filteredGuests = event.guests.filter(g => {
    if (statusFilter !== 'all' && g.status !== statusFilter) return false;
    if (searchQuery && !g.name.toLowerCase().includes(searchQuery.toLowerCase()) && !(g.groupTag || '').toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <Users className="w-6 h-6 text-emerald-500" />
            <span>Guest List & RSVP Manager</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track headcount, seat tables, and manage dietary restrictions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportGuestCsv}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          
          <button
            onClick={openAddModal}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Guest</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Capacity</span>
          <div className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-1.5">
            {event.guestCount}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Maximum planned guests</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attending Confirmed</span>
          <div className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400 mt-1.5">
            {attendingCount}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block font-medium">
            {Math.round((attendingCount / event.guestCount) * 100)}% of target
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Awaiting Response</span>
          <div className="text-2xl font-bold font-display text-amber-500 mt-1.5">
            {pendingCount}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Pending invitations</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Declined</span>
          <div className="text-2xl font-bold font-display text-slate-500 mt-1.5">
            {declinedCount}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Unable to attend</span>
        </div>

      </div>

      {/* Dietary Alert Box */}
      {dietaryList.length > 0 && (
        <div className="glass-panel p-4 rounded-2xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 space-y-2">
          <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider">
            <Utensils className="w-4 h-4 text-amber-600" />
            <span>Catering Dietary Alerts ({dietaryList.length} guests)</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {dietaryList.map((d, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg text-xs bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 font-medium text-slate-800 dark:text-slate-200 shadow-sm">
                {d}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Search & Status Filters */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or group (e.g. Family)..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none"
          >
            <option value="all">All RSVP Statuses</option>
            <option value="attending">Attending</option>
            <option value="pending">Pending</option>
            <option value="declined">Declined</option>
          </select>
        </div>

      </div>

      {/* Guest Table */}
      <div className="glass-panel rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Guest Name</th>
                <th className="py-3 px-3 text-center">Party</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Group / Table</th>
                <th className="py-3 px-3">Dietary Needs</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No guests found.
                  </td>
                </tr>
              ) : (
                filteredGuests.map(guest => (
                  <tr key={guest.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {guest.name}
                      </p>
                      {(guest.email || guest.phone) && (
                        <p className="text-[11px] text-slate-400">
                          {guest.email || guest.phone}
                        </p>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center font-bold font-mono">
                      {guest.partySize}
                    </td>

                    <td className="py-3 px-3">
                      <select
                        value={guest.status}
                        onChange={(e) => handleQuickStatus(guest, e.target.value as RsvpStatus)}
                        className={`text-xs font-semibold px-2 py-1 rounded-xl border focus:outline-none ${
                          guest.status === 'attending'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                            : guest.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                            : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                        }`}
                      >
                        <option value="attending">Attending</option>
                        <option value="pending">Pending</option>
                        <option value="declined">Declined</option>
                      </select>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {guest.groupTag || '—'}
                      </span>
                      {guest.tableNumber && (
                        <span className="block text-[11px] text-slate-400 font-mono">
                          {guest.tableNumber}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <span className={guest.dietaryRestrictions && guest.dietaryRestrictions.toLowerCase() !== 'none' ? 'font-semibold text-amber-600 dark:text-amber-400' : 'text-slate-400'}>
                        {guest.dietaryRestrictions || 'None'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => openEditModal(guest)}
                          title="Edit Guest"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteGuest(guest.id)}
                          title="Delete Guest"
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

      {/* Add / Edit Guest Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg glass-dropdown p-6 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">
              {editingGuest ? 'Edit Guest' : 'Add Guest to List'}
            </h3>

            <form onSubmit={handleSaveGuest} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Guest / Party Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Maya Lin & Guest"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Party Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formPartySize}
                    onChange={(e) => setFormPartySize(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="maya@example.com"
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
                    placeholder="(555) 123-4567"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    RSVP Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as RsvpStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  >
                    <option value="attending">Attending</option>
                    <option value="pending">Pending</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Group / Circle
                  </label>
                  <input
                    type="text"
                    value={formGroup}
                    onChange={(e) => setFormGroup(e.target.value)}
                    placeholder="Family, VIP, College..."
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Table # / Area
                  </label>
                  <input
                    type="text"
                    value={formTable}
                    onChange={(e) => setFormTable(e.target.value)}
                    placeholder="Table 4"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dietary Restrictions & Allergies
                </label>
                <input
                  type="text"
                  value={formDietary}
                  onChange={(e) => setFormDietary(e.target.value)}
                  placeholder="e.g. Vegetarian, Nut Allergy, Gluten-Free..."
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-sm"
                >
                  {editingGuest ? 'Save Changes' : 'Add Guest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
