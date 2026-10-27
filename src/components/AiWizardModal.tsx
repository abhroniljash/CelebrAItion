import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Heart, 
  Cake, 
  Users, 
  Building, 
  PartyPopper, 
  Check, 
  Loader2, 
  CheckCircle2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventType, CurrencySymbol, EventPlan } from '../types';
import { WizardInput, generateCompleteEventPlan } from '../services/aiEngine';

interface AiWizardModalProps {
  apiKey?: string;
  onClose: () => void;
  onEventCreated: (newEvent: EventPlan) => void;
}

const EVENT_TYPE_OPTIONS: { type: EventType; label: string; icon: any; desc: string; defaultVibe: string }[] = [
  { 
    type: 'wedding', 
    label: 'Wedding & Reception', 
    icon: Heart, 
    desc: 'Ceremony, vows, reception, florals, photography & run-of-show',
    defaultVibe: 'Romantic garden romance with champagne gold and eucalyptus olive foliage'
  },
  { 
    type: 'birthday', 
    label: 'Birthday Celebration', 
    icon: Cake, 
    desc: 'Milestone birthday, themes, catering, music, games & custom cake',
    defaultVibe: 'High-energy retro neon arcade bash with craft cocktails and DJ beats'
  },
  { 
    type: 'community', 
    label: 'Community Event & Festival', 
    icon: Users, 
    desc: 'Block party, seasonal harvest festival, permits, food trucks & crowds',
    defaultVibe: 'Warm autumn harvest festival with artisan food trucks, live folk music and twilight lanterns'
  },
  { 
    type: 'corporate', 
    label: 'Corporate Gala & Retreat', 
    icon: Building, 
    desc: 'Conferences, gala awards, networking dinners, AV & keynote schedules',
    defaultVibe: 'Sleek modern executive gala with brass accents, plated dinner and stage lighting'
  },
  { 
    type: 'party', 
    label: 'Custom Party / Social', 
    icon: PartyPopper, 
    desc: 'Anniversary, housewarming, retirement, or holiday gathering',
    defaultVibe: 'Chic rooftop cocktail party with sunset views, grazing boards and acoustic tunes'
  }
];

const CURRENCIES: CurrencySymbol[] = ['$', '€', '£', '₹', 'A$', 'C$', '¥'];

const VIBE_SUGGESTIONS = [
  'Bohemian Rustic Vineyard',
  'Cyberpunk 80s Neon Arcade',
  'Autumn Harvest & Paper Lanterns',
  'Modern Minimalist Luxe',
  'Emerald Garden Floral Sanctuary',
  'Tropical Sunset Beach Fiesta',
  'Vintage 1920s Gatsby Speakeasy'
];

export const AiWizardModal: React.FC<AiWizardModalProps> = ({
  apiKey,
  onClose,
  onEventCreated
}) => {
  const [step, setStep] = useState<number>(1);
  
  // Step 1
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-10-15');
  const [time, setTime] = useState('16:00');

  // Step 2
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState<number>(75);
  const [totalBudget, setTotalBudget] = useState<number>(15000);
  const [currency, setCurrency] = useState<CurrencySymbol>('$');

  // Step 3
  const [vibe, setVibe] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Step 4 (Generating & Preview)
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<EventPlan | null>(null);
  const [generationPhase, setGenerationPhase] = useState<string>('');

  const handleNextToScale = () => {
    if (!title.trim()) {
      const selectedOption = EVENT_TYPE_OPTIONS.find(o => o.type === eventType);
      setTitle(`My ${selectedOption?.label || 'Special Celebration'}`);
    }
    setStep(2);
  };

  const handleNextToVibe = () => {
    if (!vibe) {
      const selectedOption = EVENT_TYPE_OPTIONS.find(o => o.type === eventType);
      setVibe(selectedOption?.defaultVibe || 'Warm, memorable, and fun');
    }
    setStep(3);
  };

  const handleStartGeneration = async () => {
    setStep(4);
    setIsGenerating(true);
    setGenerationPhase('Analyzing event scale & guest count...');

    try {
      const wizardInput: WizardInput = {
        title: title.trim(),
        eventType,
        date,
        time,
        location: location.trim() || 'Selected Event Venue',
        guestCount: Number(guestCount) || 50,
        totalBudget: Number(totalBudget) || 10000,
        currency,
        vibe: vibe.trim() || 'Warm, unforgettable celebration',
        specialRequests: specialRequests.trim()
      };

      // Simulated progressive updates for immersive AI experience
      setTimeout(() => setGenerationPhase('Harmonizing 5-tone color palette & visual theme...'), 600);
      setTimeout(() => setGenerationPhase('Synthesizing proportional budget allocation...'), 1200);
      setTimeout(() => setGenerationPhase('Structuring timeline roadmap & run-of-show...'), 1800);
      setTimeout(() => setGenerationPhase('Drafting vendor checklists & interview vetting questions...'), 2400);

      const plan = await generateCompleteEventPlan(wizardInput, apiKey);
      
      // Delay slightly so user sees the progress steps
      await new Promise(r => setTimeout(r, 2600));

      setGeneratedPlan(plan);
      setIsGenerating(false);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.5 }
        });
      } catch {}
    } catch (err) {
      console.error('Failed to generate plan', err);
      setIsGenerating(false);
    }
  };

  const handleAdoptPlan = () => {
    if (generatedPlan) {
      onEventCreated(generatedPlan);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl glass-dropdown p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 my-auto">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4 animate-pulse-subtle" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                GenAI Event Planner Wizard
              </h2>
              <p className="text-xs text-slate-400">
                Step {step} of 4: {step === 1 ? 'Event Type' : step === 2 ? 'Scale & Budget' : step === 3 ? 'Vision & Vibe' : 'AI Generation'}
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

        {/* STEP 1: Event Type & Basics */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                What kind of event are you organizing?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EVENT_TYPE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = eventType === opt.type;
                  return (
                    <button
                      type="button"
                      key={opt.type}
                      onClick={() => {
                        setEventType(opt.type);
                        setVibe(opt.defaultVibe);
                      }}
                      className={`p-3.5 rounded-2xl border text-left flex items-start space-x-3 transition-all ${
                        isSelected 
                          ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/30 ring-2 ring-rose-500/30' 
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                      }`}
                    >
                      <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                        isSelected 
                          ? 'bg-rose-500 text-white' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">
                          {opt.label}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Maya & Julian's Summer Vineyard Wedding, Max's 10th Birthday..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleNextToScale}
                className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-md transition-all"
              >
                <span>Continue: Scale & Budget</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Scale, Location & Budget */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Location or City
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Napa Valley, CA / Downtown Austin Rooftop / Central Community Park..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Estimated Guest Count: <strong className="text-rose-600 dark:text-rose-400 font-mono text-base">{guestCount}</strong>
                </label>
                <input
                  type="range"
                  min="5"
                  max="500"
                  step="5"
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value) || 20)}
                  className="w-full accent-rose-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>5 (Intimate)</span>
                  <span>100 (Medium)</span>
                  <span>500+ (Festival)</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Currency & Total Budget Target
                </label>
                <div className="flex items-center space-x-2">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as CurrencySymbol)}
                    className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                  >
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>

                  <input
                    type="number"
                    min="100"
                    step="500"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 1000)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-base font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Our GenAI calculates realistic allocations for catering, venue, photo, and AV.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNextToVibe}
                className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-md transition-all"
              >
                <span>Continue: Vibe & Style</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Vision, Vibe & Special Requests */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Describe the Vibe, Aesthetic or Mood *
              </label>
              <textarea
                rows={3}
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                placeholder="e.g. Tuscan romance with neutral linens, olive greenery, candlelight, and live acoustic Spanish guitar..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed"
              />

              <div className="mt-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Quick Inspiration Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {VIBE_SUGGESTIONS.map((sug, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setVibe(sug)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Special Requests or Dietary / Technical Constraints (Optional)
              </label>
              <input
                type="text"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Strict vegan menu options, outdoor rain contingency needed, photo booth required..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleStartGeneration}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-amber-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold shadow-lg shadow-rose-500/25 transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Master Blueprint with AI</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Live Generation & Final Preview */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in text-xs sm:text-sm">
            {isGenerating ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 animate-spin flex items-center justify-center shadow-lg" />
                  <Sparkles className="w-8 h-8 text-white absolute inset-0 m-auto animate-pulse" />
                </div>
                
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Crafting Your Custom Event Blueprint...
                  </h3>
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-1 animate-pulse">
                    {generationPhase}
                  </p>
                </div>

                <div className="max-w-xs text-[11px] text-slate-400">
                  Synthesizing vendor budgets, milestone timing, color harmony, and personalized ideas.
                </div>
              </div>
            ) : generatedPlan ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      Master Blueprint Successfully Synthesized!
                    </h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300">
                      Tailored specifically for {generatedPlan.title} ({generatedPlan.guestCount} guests).
                    </p>
                  </div>
                </div>

                {/* Preview summary boxes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Budget Items</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      {generatedPlan.budgetItems.length} Allocations
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Timeline Slots</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      {generatedPlan.timelineItems.length} Milestones
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Vendor Checklists</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      {generatedPlan.vendors.length} Categories
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Curated Ideas</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      {generatedPlan.ideas.length} Concepts
                    </span>
                  </div>
                </div>

                {/* Color swatches preview */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Synthesized Color Palette
                  </span>
                  <div className="grid grid-cols-5 gap-2">
                    {generatedPlan.colorPalette.map((c, idx) => (
                      <div key={idx} className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
                        <div className="w-full h-8 rounded-lg shadow-inner mb-1" style={{ backgroundColor: c.hex }} />
                        <span className="text-[10px] font-bold block truncate">{c.name}</span>
                        <span className="text-[9px] font-mono text-slate-400">{c.hex}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Adjust Inputs
                  </button>

                  <button
                    type="button"
                    onClick={handleAdoptPlan}
                    className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Adopt & Open Master Plan</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

      </div>
    </div>
  );
};
