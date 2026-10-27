import { EventPlan, EventType, CurrencySymbol, BudgetItem, TimelineItem, VendorItem, IdeaItem, ColorSwatch } from '../types';
import { callGeminiRaw } from './geminiLive';

export interface WizardInput {
  title: string;
  eventType: EventType;
  date: string;
  time?: string;
  location: string;
  guestCount: number;
  totalBudget: number;
  currency: CurrencySymbol;
  vibe: string;
  specialRequests?: string;
}

// Color palettes tailored by theme keywords and event types
const THEME_PALETTES: Record<string, ColorSwatch[]> = {
  romantic: [
    { name: 'Blush Velvet', hex: '#F4B6C2', role: 'Floral Accent' },
    { name: 'Champagne Gold', hex: '#E6C280', role: 'Metallic Glow' },
    { name: 'Sage Eucalyptus', hex: '#879F84', role: 'Foliage & Greenery' },
    { name: 'Alabaster Ivory', hex: '#FDFBF7', role: 'Linen Neutral' },
    { name: 'Dusty Rose', hex: '#C27D88', role: 'Contrast Detail' },
  ],
  rustic: [
    { name: 'Olive Grove', hex: '#5B6849', role: 'Foliage & Trees' },
    { name: 'Terracotta Clay', hex: '#BD6448', role: 'Earthy Warmth' },
    { name: 'Warm Amber', hex: '#D68C45', role: 'Candlelight Tone' },
    { name: 'Linen Sand', hex: '#EBE3D5', role: 'Neutral Texture' },
    { name: 'Charcoal Slate', hex: '#3E424B', role: 'Contrast Accent' },
  ],
  neon: [
    { name: 'Cyber Magenta', hex: '#FF007F', role: 'Primary Glow' },
    { name: 'Electric Cyan', hex: '#00F0FF', role: 'Secondary Neon' },
    { name: 'Laser Lime', hex: '#39FF14', role: 'High Voltage Pop' },
    { name: 'Deep Ultraviolet', hex: '#6B11FF', role: 'Ambient Background' },
    { name: 'Void Black', hex: '#0B0B12', role: 'Dark Surface Canvas' },
  ],
  autumn: [
    { name: 'Harvest Pumpkin', hex: '#E06D28', role: 'Primary Warm Hero' },
    { name: 'Goldenrod Marigold', hex: '#E8A317', role: 'Festive Cheer' },
    { name: 'Forest Moss', hex: '#3D5239', role: 'Park & Foliage' },
    { name: 'Cinnamon Spice', hex: '#8C3D28', role: 'Warm Depth' },
    { name: 'Night Twilight', hex: '#1C2833', role: 'Evening Atmosphere' },
  ],
  modern: [
    { name: 'Monochrome Slate', hex: '#1E293B', role: 'Primary Structural' },
    { name: 'Brushed Brass', hex: '#C5A880', role: 'Warm Metallic Accent' },
    { name: 'Pure Chalk', hex: '#F8FAFC', role: 'Clean Minimal Surface' },
    { name: 'Smoky Pewter', hex: '#64748B', role: 'Subtle Neutral' },
    { name: 'Obsidian Black', hex: '#0F172A', role: 'Anchor Contrast' },
  ],
  tropical: [
    { name: 'Palm Frond', hex: '#1B4D3E', role: 'Lush Botanical' },
    { name: 'Hibiscus Coral', hex: '#FF6F59', role: 'Punchy Floral' },
    { name: 'Sunlit Mango', hex: '#FFAE03', role: 'Tropical Vibrance' },
    { name: 'Lagoon Turquoise', hex: '#25CED1', role: 'Water Sparkle' },
    { name: 'Coconut Cream', hex: '#F7F4EA', role: 'Warm Sand Base' },
  ]
};

function selectPaletteForVibe(vibe: string, eventType: EventType): ColorSwatch[] {
  const v = vibe.toLowerCase();
  if (v.includes('neon') || v.includes('cyber') || v.includes('retro') || v.includes('arcade') || v.includes('80s') || v.includes('glow')) {
    return THEME_PALETTES.neon;
  }
  if (v.includes('autumn') || v.includes('harvest') || v.includes('fall') || v.includes('lantern') || v.includes('rustic')) {
    return THEME_PALETTES.autumn;
  }
  if (v.includes('tropical') || v.includes('beach') || v.includes('summer') || v.includes('fiesta') || v.includes('luau')) {
    return THEME_PALETTES.tropical;
  }
  if (v.includes('modern') || v.includes('minimal') || v.includes('chic') || v.includes('monochrome') || v.includes('corporate') || v.includes('gala')) {
    return THEME_PALETTES.modern;
  }
  if (eventType === 'wedding' || v.includes('romantic') || v.includes('garden') || v.includes('bohemian') || v.includes('vintage')) {
    return THEME_PALETTES.romantic;
  }
  return THEME_PALETTES.rustic;
}

export function generateContextualEventBlueprint(input: WizardInput): EventPlan {
  const id = `event-${Date.now()}`;
  const budget = Math.max(input.totalBudget || 5000, 500);
  const guests = Math.max(input.guestCount || 30, 5);
  const palette = selectPaletteForVibe(input.vibe, input.eventType);

  // Proportional budget distribution by event type
  let budgetItems: BudgetItem[] = [];
  let timelineItems: TimelineItem[] = [];
  let vendors: VendorItem[] = [];
  let ideas: IdeaItem[] = [];

  if (input.eventType === 'wedding') {
    const venueCost = Math.round(budget * 0.30);
    const cateringCost = Math.round(budget * 0.28);
    const photoCost = Math.round(budget * 0.12);
    const decorCost = Math.round(budget * 0.10);
    const musicCost = Math.round(budget * 0.08);
    const attireCost = Math.round(budget * 0.06);
    const stationeryCost = Math.round(budget * 0.03);
    const contingencyCost = Math.round(budget * 0.03);

    budgetItems = [
      {
        id: `b-${id}-1`,
        category: 'Venue & Rentals',
        name: `${input.location || 'Ceremony & Reception Venue'} (Rental & Tables/Chairs)`,
        estimatedCost: venueCost,
        actualCost: 0,
        paidAmount: 0,
        status: 'planned',
        priority: 'essential',
        notes: `Accommodates target of ${guests} guests with ceremony lawn and reception ballroom/patio.`
      },
      {
        id: `b-${id}-2`,
        category: 'Catering & Beverages',
        name: `Plated Dinner, Cocktail Hour Canapés & Open Bar (${guests} guests)`,
        estimatedCost: cateringCost,
        actualCost: 0,
        paidAmount: 0,
        status: 'planned',
        priority: 'essential',
        notes: `Est. $${Math.round(cateringCost / guests)}/guest including service, bar staff, and glassware.`
      },
      {
        id: `b-${id}-3`,
        category: 'Photography & Videography',
        name: 'Full-Day Photo & Cinema Coverage (Drone + 2 Photographers)',
        estimatedCost: photoCost,
        actualCost: 0,
        paidAmount: 0,
        status: 'planned',
        priority: 'essential',
        notes: 'Covers preparation, first look, ceremony, speeches, and sparkler exit.'
      },
      {
        id: `b-${id}-4`,
        category: 'Decor, Florals & Lighting',
        name: `Curated ${palette[0].name} Florals, Ceremony Arch & Romantic String Lights`,
        estimatedCost: decorCost,
        actualCost: 0,
        paidAmount: 0,
        status: 'planned',
        priority: 'recommended',
        notes: `Focuses on ${palette[0].name} and ${palette[1].name} seasonal blooms and pillar candles.`
      },
      {
        id: `b-${id}-5`,
        category: 'Entertainment, Music & AV',
        name: 'Ceremony Acoustic Musician + Reception DJ/MC & Dance Floor Lights',
        estimatedCost: musicCost,
        actualCost: 0,
        paidAmount: 0,
        status: 'planned',
        priority: 'recommended',
        notes: 'Sound system, wireless lapel mics, dance floor lighting setup.'
      },
      {
        id: `b-${id}-6`,
        category: 'Attire, Beauty & Rings',
        name: 'Wedding Attire, Tailoring, Hair Styling & Makeup',
        estimatedCost: attireCost,
        actualCost: 0,
        paidAmount: 0,
        status: 'planned',
        priority: 'essential',
        notes: 'Wedding party styling and groom/bridal preparation.'
      },
      {
        id: `b-${id}-7`,
        category: 'Invitations, Favors & Signage',
        name: 'Custom Invitation Suite, Welcome Sign & Keepsake Favors',
        estimatedCost: stationeryCost,
        actualCost: 0,
        paidAmount: 0,
        status: 'planned',
        priority: 'recommended',
        notes: 'Letterpress or digital gold-foil printed stationery.'
      },
      {
        id: `b-${id}-8`,
        category: 'Contingency & Emergency Reserve',
        name: 'Weather Contingency & Day-Of Buffer',
        estimatedCost: contingencyCost,
        actualCost: 0,
        paidAmount: 0,
        status: 'planned',
        priority: 'essential',
        notes: 'Emergency buffer for weather adjustments or unexpected additions.'
      }
    ];

    timelineItems = [
      { id: `t-${id}-1`, phase: 'planning_early', timeLabel: '9-12 Months Out', title: 'Lock Venue & Deposit', description: `Secure venue at ${input.location || 'chosen location'} and lock official date.`, category: 'Venue', completed: false, isKeyMilestone: true },
      { id: `t-${id}-2`, phase: 'planning_early', timeLabel: '8 Months Out', title: 'Book Photographer & Videographer', description: 'Review portfolios and secure lead photographer for golden hour portraits.', category: 'Photography', completed: false, isKeyMilestone: true },
      { id: `t-${id}-3`, phase: 'planning_mid', timeLabel: '5 Months Out', title: 'Catering Tasting & Menu Selection', description: 'Taste seasonal dishes, finalize vegetarian/allergen options, select 2 signature cocktails.', category: 'Catering', completed: false, isKeyMilestone: true },
      { id: `t-${id}-4`, phase: 'planning_mid', timeLabel: '3 Months Out', title: 'Send Formal Invitations', description: `Mail stationery or digital RSVPs to all ${guests} expected guests with deadline.`, category: 'Invitations', completed: false },
      { id: `t-${id}-5`, phase: 'planning_late', timeLabel: '3 Weeks Out', title: 'Final RSVP Headcount & Seating Chart', description: 'Submit final plate counts to caterer and design table chart layout.', category: 'Guests', completed: false, isKeyMilestone: true },
      { id: `t-${id}-6`, phase: 'week_of', timeLabel: '1 Day Out', title: 'Ceremony Rehearsal & Welcome Toast', description: 'Walk through processional order, practice vows with officiant, hand off decor boxes.', category: 'Ceremony', completed: false },
      { id: `t-${id}-7`, phase: 'day_of', timeLabel: '09:00 AM', title: 'Hair & Makeup Suite Opens', description: 'Bridal party preparation, light brunch snacks, and steaming attire.', category: 'Preparation', completed: false },
      { id: `t-${id}-8`, phase: 'day_of', timeLabel: '13:30 PM', title: 'Photographer Arrives & Details Flat Lays', description: 'Photograph invitations, rings, shoes, dress, and candid prep moments.', category: 'Photography', completed: false },
      { id: `t-${id}-9`, phase: 'day_of', timeLabel: '14:45 PM', title: 'First Look & Couple Portraits', description: 'Intimate first look reveal followed by bridal party portraits.', category: 'Photography', completed: false, isKeyMilestone: true },
      { id: `t-${id}-10`, phase: 'day_of', timeLabel: '16:00 PM', title: 'Ceremony Begins', description: 'Guest processional, music, vow exchange, first kiss, and recessional cheers.', category: 'Ceremony', completed: false, isKeyMilestone: true },
      { id: `t-${id}-11`, phase: 'day_of', timeLabel: '17:00 PM', title: 'Cocktail Hour & Passed Canapés', description: 'Signature cocktails served while newlyweds capture golden hour portraits.', category: 'Reception', completed: false },
      { id: `t-${id}-12`, phase: 'day_of', timeLabel: '18:30 PM', title: 'Dinner, Speeches & First Dance', description: 'Plated dinner, maid of honor & best man speeches, romantic first dance.', category: 'Reception', completed: false, isKeyMilestone: true },
      { id: `t-${id}-13`, phase: 'day_of', timeLabel: '20:30 PM', title: 'Cake Cutting & Dance Floor Explosion', description: 'Dessert table opens and DJ kicks off high-energy dance party.', category: 'Music', completed: false },
      { id: `t-${id}-14`, phase: 'day_of', timeLabel: '23:00 PM', title: 'Grand Sparkler / Confetti Send-Off', description: 'Couple farewell through guest tunnel; shuttles depart.', category: 'Send-Off', completed: false }
    ];

    vendors = [
      {
        id: `v-${id}-1`,
        category: 'Venue',
        name: 'The Grand View Estate & Gardens',
        contactPerson: 'Event Sales Director',
        email: 'events@grandviewestates.com',
        phone: '(555) 234-5678',
        quoteAmount: venueCost,
        status: 'researching',
        keyQuestionsToAsk: [
          'What is the sound curfew and decibel limit?',
          'Are there bridal and groom prep suites on-site?',
          'Is a certified day-of coordinator required?'
        ]
      },
      {
        id: `v-${id}-2`,
        category: 'Catering & Bar',
        name: 'Artisan Culinary Group',
        contactPerson: 'Chef Laurent',
        email: 'info@artisanculinary.com',
        phone: '(555) 876-5432',
        quoteAmount: cateringCost,
        status: 'researching',
        keyQuestionsToAsk: [
          'Does the quote include table linens, cutlery, and glassware?',
          'What is your staff-to-guest ratio for plated service?',
          'How do you accommodate severe allergies and vegan guests?'
        ]
      },
      {
        id: `v-${id}-3`,
        category: 'Photography',
        name: 'Luminous Moments Fine Art Photography',
        contactPerson: 'Sarah Jenkins',
        email: 'sarah@luminousmoments.com',
        phone: '(555) 345-6789',
        quoteAmount: photoCost,
        status: 'researching',
        keyQuestionsToAsk: [
          'Does the package include a second shooter and engagement shoot?',
          'What is the estimated delivery timeframe for online galleries?',
          'Do we receive full high-resolution digital print rights?'
        ]
      },
      {
        id: `v-${id}-4`,
        category: 'Florist & Decor',
        name: 'Blossom & Bough Floral Design',
        contactPerson: 'Mia Chen',
        email: 'mia@blossomandbough.com',
        phone: '(555) 901-2345',
        quoteAmount: decorCost,
        status: 'researching',
        keyQuestionsToAsk: [
          'Can ceremony florals be repurposed to the reception dinner tables?',
          'Do you supply rental vessels, candle holders, and arch hardware?',
          'What time do you arrive for setup and teardown?'
        ]
      }
    ];

    ideas = [
      {
        id: `i-${id}-1`,
        category: 'interactive',
        title: 'Vintage Audio Guestbook Station',
        description: 'Provide an authentic rotary dial phone where guests leave voice-recorded well-wishes, jokes, and heartfelt congratulations throughout the evening.',
        tags: ['Interactive', 'Keepsake', 'Emotional'],
        costImpact: 'low',
        difficulty: 'easy',
        bookmarked: true,
        aiSuggestedReason: `Fits beautifully with your ${input.vibe} theme and gives you audio memories to listen to forever.`
      },
      {
        id: `i-${id}-2`,
        category: 'food_drinks',
        title: 'Bespoke "His & Hers" Handcrafted Cocktails',
        description: 'Collaborate with the bar to design two signature drinks reflecting your personal favorites, styled with custom printed edible cocktail toppers or branded ice cubes.',
        tags: ['Signature Drink', 'Personalized', 'Photo-worthy'],
        costImpact: 'low',
        difficulty: 'easy',
        bookmarked: true,
        aiSuggestedReason: 'One of the most cost-effective ways to make the bar experience feel customized.'
      },
      {
        id: `i-${id}-3`,
        category: 'decor',
        title: 'Hanging Edison Chandeliers with Greenery Boughs',
        description: 'Suspend low-hanging exposed filament bulbs intertwined with greenery runners above the long feast tables for an enchanted dining sanctuary.',
        tags: ['Lighting', 'Warm Vibe', 'Atmosphere'],
        costImpact: 'medium',
        difficulty: 'moderate',
        bookmarked: false,
        aiSuggestedReason: 'Creates cozy intimacy in any venue, especially as natural daylight transitions into evening.'
      },
      {
        id: `i-${id}-4`,
        category: 'favors',
        title: 'Artisanal Seed Paper Escort Cards',
        description: 'Wildflower seed paper cards printed with guest names and table numbers that guests can take home and plant in their garden in honor of the wedding.',
        tags: ['Eco-friendly', 'Meaningful', 'Plantable'],
        costImpact: 'low',
        difficulty: 'easy',
        bookmarked: true,
        aiSuggestedReason: 'Zero waste, highly sustainable, and creates blooming flowers for your guests months later.'
      }
    ];
  } else if (input.eventType === 'birthday') {
    const venueCost = Math.round(budget * 0.35);
    const foodCost = Math.round(budget * 0.28);
    const entertainmentCost = Math.round(budget * 0.18);
    const decorCost = Math.round(budget * 0.10);
    const favorsCost = Math.round(budget * 0.05);
    const bufferCost = Math.round(budget * 0.04);

    budgetItems = [
      {
        id: `b-${id}-1`,
        category: 'Venue & Rentals',
        name: `${input.location || 'Private Event Space / Lounge Rental'} (4-5 Hours)`,
        estimatedCost: venueCost,
        actualCost: 0,
        paidAmount: 0,
        status: 'planned',
        priority: 'essential',
        notes: `Private space with audio/lighting setup for ${guests} guests.`
      },
      {
        id: `b-${id}-2`,
        category: 'Catering & Beverages',
        name: `Curated Finger Foods, Custom Cake & Signature Bar (${guests} guests)`,
        estimatedCost: foodCost,
        actualCost: 0,
        paidAmount: 0,
        status: 'planned',
        priority: 'essential',
        notes: 'Gourmet slider station, grazing board, custom themed birthday cake.'
      },
      {
        id: `b-${id}-3`,
        category: 'Entertainment, Music & AV',
        name: 'Live DJ / Interactive Entertainment & Photo Booth',
        estimatedCost: entertainmentCost,
        actualCost: 0,
        paidAmount: 0,
        status: 'planned',
        priority: 'recommended',
        notes: 'High energy music curation and physical instant-print photo station.'
      },
      {
        id: `b-${id}-4`,
        category: 'Decor, Florals & Lighting',
        name: `Custom Themed Backdrop, Lighting & Balloon / Floral Installation`,
        estimatedCost: decorCost,
        actualCost: 0,
        paidAmount: 0,
        status: 'planned',
        priority: 'recommended',
        notes: `Styled with ${palette[0].name} and ${palette[1].name} colors.`
      },
      {
        id: `b-${id}-5`,
        category: 'Invitations, Favors & Signage',
        name: 'Custom Swag / Favors & Welcome Signage',
        estimatedCost: favorsCost,
        actualCost: 0,
        paidAmount: 0,
        status: 'planned',
        priority: 'optional',
        notes: 'Custom pins, tokens, or treat bags for guests.'
      },
      {
        id: `b-${id}-6`,
        category: 'Contingency & Emergency Reserve',
        name: 'Overtime & Last-Minute Supplies Buffer',
        estimatedCost: bufferCost,
        actualCost: 0,
        paidAmount: 0,
        status: 'planned',
        priority: 'essential',
        notes: 'Covers extra drink rounds or overtime venue fees.'
      }
    ];

    timelineItems = [
      { id: `t-${id}-1`, phase: 'planning_mid', timeLabel: '6 Weeks Out', title: 'Lock Venue & Entertainment', description: 'Reserve venue date, confirm DJ/music setup and deposit.', category: 'Venue', completed: false, isKeyMilestone: true },
      { id: `t-${id}-2`, phase: 'planning_mid', timeLabel: '4 Weeks Out', title: 'Send Digital Invites', description: `Send paperless post / digital invitations to ${guests} guests with RSVP date.`, category: 'Invitations', completed: false },
      { id: `t-${id}-3`, phase: 'planning_late', timeLabel: '10 Days Out', title: 'Order Custom Cake & Food Quantities', description: 'Confirm cake design and allergy adjustments with baker/caterer.', category: 'Catering', completed: false, isKeyMilestone: true },
      { id: `t-${id}-4`, phase: 'day_of', timeLabel: '17:00 PM', title: 'Venue Load-in & Lighting Checks', description: 'Set up photo booth, test DJ sound level, test uplighting.', category: 'Logistics', completed: false },
      { id: `t-${id}-5`, phase: 'day_of', timeLabel: '19:00 PM', title: 'Guests Arrive & Welcome Drinks', description: 'Signature cocktails flowing, grazing board open, background beats.', category: 'Hospitality', completed: false, isKeyMilestone: true },
      { id: `t-${id}-6`, phase: 'day_of', timeLabel: '20:30 PM', title: 'Feature Game / Entertainment Act', description: 'Fun interactive activity, trivia/tournament, or speech toast.', category: 'Entertainment', completed: false },
      { id: `t-${id}-7`, phase: 'day_of', timeLabel: '21:30 PM', title: 'Cake Cutting & Birthday Toast', description: 'Gather everyone around the cake, light sparkler candles, celebratory cheers.', category: 'Celebration', completed: false, isKeyMilestone: true },
      { id: `t-${id}-8`, phase: 'day_of', timeLabel: '22:00 PM', title: 'Peak Dance Floor / DJ Session', description: 'Favorite anthems play; photo booth high traffic.', category: 'Music', completed: false }
    ];

    vendors = [
      {
        id: `v-${id}-1`,
        category: 'Venue',
        name: 'Skyline Studio & Lounge',
        contactPerson: 'Booking Coordinator',
        email: 'hello@skylinestudiolounge.com',
        phone: '(555) 678-1234',
        quoteAmount: venueCost,
        status: 'shortlisted',
        keyQuestionsToAsk: [
          'Can we bring in external catering or must we use in-house bar?',
          'What is the audio equipment connection (Bluetooth/XLR)?',
          'Is cleanup included in the hourly fee?'
        ]
      },
      {
        id: `v-${id}-2`,
        category: 'Cake & Desserts',
        name: 'Sugar & Spark Artisanal Bakery',
        contactPerson: 'Chef Chloe',
        email: 'orders@sugarandspark.com',
        phone: '(555) 789-0123',
        quoteAmount: 250,
        status: 'shortlisted',
        keyQuestionsToAsk: [
          'Can you create custom edible fondant artwork matching our theme?',
          'Is delivery to the venue on Saturday afternoon included?'
        ]
      }
    ];

    ideas = [
      {
        id: `i-${id}-1`,
        category: 'interactive',
        title: 'Custom Photo Booth with Instant Polaroids & Sharpie Wall',
        description: 'Set up an aesthetic themed backdrop where guests take instant prints, write funny captions with metallic Sharpies, and pin them onto a lighted wire grid wall.',
        tags: ['Photo', 'Interactive', 'Instant Souvenir'],
        costImpact: 'low',
        difficulty: 'easy',
        bookmarked: true,
        aiSuggestedReason: 'Creates immediate energy and doubles as an unforgettable guestbook wall.'
      },
      {
        id: `i-${id}-2`,
        category: 'entertainment',
        title: 'Surprise Midnight Snack Delivery',
        description: 'Keep guests energized late in the evening by rolling out warm churros with chocolate dipping sauce or fresh hot pizza slices.',
        tags: ['Crowd Pleaser', 'Late Night', 'Comfort Food'],
        costImpact: 'low',
        difficulty: 'easy',
        bookmarked: true,
        aiSuggestedReason: 'Always receives massive applause from guests who stay late!'
      }
    ];
  } else {
    // Community event, festival, gala, or party
    const venueCost = Math.round(budget * 0.25);
    const rentalsCost = Math.round(budget * 0.22);
    const entertainmentCost = Math.round(budget * 0.20);
    const hospitalityCost = Math.round(budget * 0.15);
    const permitsCost = Math.round(budget * 0.10);
    const reserveCost = Math.round(budget * 0.08);

    budgetItems = [
      {
        id: `b-${id}-1`,
        category: 'Venue & Rentals',
        name: `${input.location || 'Community Park / Public Square Facility'} Fee`,
        estimatedCost: venueCost,
        actualCost: 0,
        paidAmount: 0,
        status: 'planned',
        priority: 'essential',
        notes: `Permitted access for up to ${guests} attendees with access to electricity.`
      },
      {
        id: `b-${id}-2`,
        category: 'Venue & Rentals',
        name: 'Tents, Canopies, Tables, Chairs & Waste Bins',
        estimatedCost: rentalsCost,
        actualCost: 0,
        paidAmount: 0,
        status: 'planned',
        priority: 'essential',
        notes: 'Commercial canopies for information, food, and shaded seating.'
      },
      {
        id: `b-${id}-3`,
        category: 'Entertainment, Music & AV',
        name: 'Stage Sound System, Microphones & Local Performer Stipends',
        estimatedCost: entertainmentCost,
        actualCost: 0,
        paidAmount: 0,
        status: 'planned',
        priority: 'recommended',
        notes: 'Acoustic stage performances, announcements, community awards.'
      },
      {
        id: `b-${id}-4`,
        category: 'Catering & Beverages',
        name: 'Community Refreshment Station & Water Filling Stations',
        estimatedCost: hospitalityCost,
        actualCost: 0,
        paidAmount: 0,
        status: 'planned',
        priority: 'recommended',
        notes: 'Free hydration stations, seasonal cider/lemonade, and snack tokens.'
      },
      {
        id: `b-${id}-5`,
        category: 'Permits, Insurance & Logistics',
        name: 'City Permits, Sound Variances & Liability Insurance',
        estimatedCost: permitsCost,
        actualCost: 0,
        paidAmount: 0,
        status: 'planned',
        priority: 'essential',
        notes: 'Municipal clearances and public event liability certificate.'
      },
      {
        id: `b-${id}-6`,
        category: 'Contingency & Emergency Reserve',
        name: 'First Aid Kit, Rain Shelter & Volunteer Supplies',
        estimatedCost: reserveCost,
        actualCost: 0,
        paidAmount: 0,
        status: 'planned',
        priority: 'essential',
        notes: 'Safety gear, safety vests, walkie-talkies, and emergency fund.'
      }
    ];

    timelineItems = [
      { id: `t-${id}-1`, phase: 'planning_early', timeLabel: '8 Weeks Out', title: 'Submit City Permits & Insurance', description: 'File sound variance and park reservation with municipal council.', category: 'Permits', completed: false, isKeyMilestone: true },
      { id: `t-${id}-2`, phase: 'planning_mid', timeLabel: '4 Weeks Out', title: 'Confirm Performers & Food Trucks', description: 'Schedule stage lineup and register local food vendors.', category: 'Vendors', completed: false, isKeyMilestone: true },
      { id: `t-${id}-3`, phase: 'planning_late', timeLabel: '1 Week Out', title: 'Volunteer Orientation & Signage', description: 'Distribute volunteer shift schedules and print direction signs.', category: 'Volunteers', completed: false },
      { id: `t-${id}-4`, phase: 'day_of', timeLabel: '10:00 AM', title: 'Site Setup & Canopy Assembly', description: 'Erect vendor booths, test sound amplification, position trash/recycling.', category: 'Logistics', completed: false },
      { id: `t-${id}-5`, phase: 'day_of', timeLabel: '13:00 PM', title: 'Event Gates Open to Neighborhood', description: 'Welcome announcements, opening craft booths, live music begins.', category: 'Community', completed: false, isKeyMilestone: true },
      { id: `t-${id}-6`, phase: 'day_of', timeLabel: '16:00 PM', title: 'Keynote Feature Activity / Ceremony', description: 'Community award presentation or collective celebration moment.', category: 'Main Event', completed: false, isKeyMilestone: true },
      { id: `t-${id}-7`, phase: 'day_of', timeLabel: '19:00 PM', title: 'Event Conclusion & Clean Sweep', description: 'Volunteer "Leave No Trace" cleanup, trash removal, breakdown.', category: 'Cleanup', completed: false }
    ];

    vendors = [
      {
        id: `v-${id}-1`,
        category: 'Permits & Security' as any,
        name: 'City Parks & Recreation Department',
        contactPerson: 'Community Liaison',
        email: 'parks@communitygov.org',
        phone: '(555) 456-7890',
        quoteAmount: permitsCost,
        status: 'shortlisted',
        keyQuestionsToAsk: [
          'Are trash disposal dumpsters available on site?',
          'What are the parking regulations for attendees?'
        ]
      },
      {
        id: `v-${id}-2`,
        category: 'Rentals & Furniture',
        name: 'Apex Canopy & Stage Solutions',
        contactPerson: 'David Miller',
        email: 'sales@apexcanopy.com',
        phone: '(555) 789-4321',
        quoteAmount: rentalsCost,
        status: 'researching',
        keyQuestionsToAsk: [
          'Do your canopies include 40lb sandbag anchors for safety?',
          'What is the delivery window the morning of the event?'
        ]
      }
    ];

    ideas = [
      {
        id: `i-${id}-1`,
        category: 'interactive',
        title: 'Collaborative Community Canvas Mural',
        description: 'Set up an 8x4-foot wooden canvas with outline graphics matching your theme, inviting all attendees and kids to paint a square to create a permanent neighborhood artwork.',
        tags: ['All Ages', 'Community Art', 'High Engagement'],
        costImpact: 'low',
        difficulty: 'easy',
        bookmarked: true,
        aiSuggestedReason: 'Gives attendees a shared sense of pride and can be displayed in a public building afterward.'
      },
      {
        id: `i-${id}-2`,
        category: 'sustainability',
        title: 'Zero-Waste "Green Team" Stations',
        description: 'Provide marked sorting bins for composting, recyclables, and landfill, staffed by local youth volunteers offering fun trivia stickers for proper sorting.',
        tags: ['Eco-friendly', 'Youth Leadership', 'Zero Waste'],
        costImpact: 'low',
        difficulty: 'easy',
        bookmarked: true,
        aiSuggestedReason: 'Reduces post-event trash collection fees by up to 60%.'
      }
    ];
  }

  return {
    id,
    title: input.title || `My Spectacular ${input.eventType.toUpperCase()}`,
    eventType: input.eventType,
    date: input.date || new Date().toISOString().split('T')[0],
    time: input.time || '15:00',
    location: input.location || 'TBD Venue',
    guestCount: guests,
    totalBudget: budget,
    currency: input.currency || '$',
    vibe: input.vibe || 'Warm, elegant, and unforgettable celebration',
    themeDescription: `A thoughtfully designed ${input.eventType} celebration styled around "${input.vibe}", balancing guest comfort, visual delight, and budget efficiency.`,
    dressCode: input.eventType === 'wedding' ? 'Cocktail Attire / Semi-Formal' : 'Festive Casual / Themed',
    colorPalette: palette,
    budgetItems,
    timelineItems,
    vendors,
    ideas,
    guests: [
      { id: `g-${id}-1`, name: 'VIP Host / Organizer', partySize: 2, status: 'attending', groupTag: 'Organizer' },
      { id: `g-${id}-2`, name: 'Key Family / Friends (4 pax)', partySize: 4, status: 'attending', groupTag: 'VIP' },
      { id: `g-${id}-3`, name: 'General RSVP Sample', partySize: 2, status: 'pending', groupTag: 'Friends' }
    ],
    notes: input.specialRequests ? `Special notes: ${input.specialRequests}` : 'Generated by CelebrAItion GenAI Event Planner',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export async function generateCompleteEventPlan(
  input: WizardInput,
  apiKey?: string
): Promise<EventPlan> {
  // If user provided a Gemini API Key, try calling Gemini API for an ultra-custom plan
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const prompt = `
You are a world-class luxury and community event planning director.
Create a complete, realistic, comprehensive JSON event plan for:
Event Type: ${input.eventType}
Event Title: "${input.title}"
Date: ${input.date}
Location: ${input.location}
Guest Count: ${input.guestCount}
Total Budget: ${input.currency}${input.totalBudget}
Vibe & Vision: "${input.vibe}"
Special Requests: "${input.specialRequests || 'None'}"

Return ONLY valid JSON matching this exact structure:
{
  "themeDescription": "string (2-3 sentences)",
  "dressCode": "string",
  "colorPalette": [
    { "name": "string", "hex": "#HEX", "role": "string" } // exactly 5 colors
  ],
  "budgetItems": [
    {
      "category": "Venue & Rentals" | "Catering & Beverages" | "Photography & Videography" | "Decor, Florals & Lighting" | "Entertainment, Music & AV" | "Attire, Beauty & Rings" | "Invitations, Favors & Signage" | "Permits, Insurance & Logistics" | "Contingency & Emergency Reserve",
      "name": "string",
      "estimatedCost": number,
      "actualCost": 0,
      "paidAmount": 0,
      "status": "planned",
      "priority": "essential" | "recommended" | "optional",
      "notes": "string"
    }
  ],
  "timelineItems": [
    {
      "phase": "planning_early" | "planning_mid" | "planning_late" | "week_of" | "day_of",
      "timeLabel": "string (e.g. 6 Months Out, 14:00 PM)",
      "title": "string",
      "description": "string",
      "category": "string",
      "completed": false,
      "isKeyMilestone": boolean
    }
  ],
  "vendors": [
    {
      "category": "Venue" | "Catering & Bar" | "Photography" | "Videography" | "Florist & Decor" | "DJ & Live Band" | "Rentals & Furniture",
      "name": "string",
      "contactPerson": "string",
      "quoteAmount": number,
      "status": "researching",
      "keyQuestionsToAsk": ["question 1", "question 2", "question 3"]
    }
  ],
  "ideas": [
    {
      "category": "theme" | "decor" | "food_drinks" | "entertainment" | "favors" | "interactive" | "sustainability",
      "title": "string",
      "description": "string",
      "tags": ["tag1", "tag2"],
      "costImpact": "low" | "medium" | "high",
      "difficulty": "easy" | "moderate" | "involved",
      "bookmarked": true,
      "aiSuggestedReason": "string"
    }
  ]
}
`;

      const responseText = await callGeminiRaw(
        prompt, 
        apiKey, 
        'You are a professional event producer. Return only pure JSON without markdown markdown fences if possible.'
      );

      // Clean JSON string
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const basePlan = generateContextualEventBlueprint(input);
      
      return {
        ...basePlan,
        themeDescription: parsed.themeDescription || basePlan.themeDescription,
        dressCode: parsed.dressCode || basePlan.dressCode,
        colorPalette: Array.isArray(parsed.colorPalette) && parsed.colorPalette.length > 0 ? parsed.colorPalette : basePlan.colorPalette,
        budgetItems: Array.isArray(parsed.budgetItems) && parsed.budgetItems.length > 0 
          ? parsed.budgetItems.map((b: any, idx: number) => ({ ...b, id: `b-${basePlan.id}-${idx + 1}` }))
          : basePlan.budgetItems,
        timelineItems: Array.isArray(parsed.timelineItems) && parsed.timelineItems.length > 0
          ? parsed.timelineItems.map((t: any, idx: number) => ({ ...t, id: `t-${basePlan.id}-${idx + 1}` }))
          : basePlan.timelineItems,
        vendors: Array.isArray(parsed.vendors) && parsed.vendors.length > 0
          ? parsed.vendors.map((v: any, idx: number) => ({ ...v, id: `v-${basePlan.id}-${idx + 1}` }))
          : basePlan.vendors,
        ideas: Array.isArray(parsed.ideas) && parsed.ideas.length > 0
          ? parsed.ideas.map((i: any, idx: number) => ({ ...i, id: `i-${basePlan.id}-${idx + 1}` }))
          : basePlan.ideas,
      };
    } catch (err) {
      console.warn('Gemini API call failed or timed out. Falling back smoothly to contextual AI blueprint.', err);
    }
  }

  // Graceful high-fidelity built-in engine
  return generateContextualEventBlueprint(input);
}

export async function generateAiChatReply(
  userQuery: string,
  event: EventPlan,
  chatHistory: { role: string; content: string }[],
  apiKey?: string
): Promise<{ text: string; actionSuggestions?: any[] }> {
  // If user has provided a Gemini API Key
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const systemPrompt = `
You are PlanBot, an elite, witty, warmly supportive AI event planning director.
You are assisting with an event:
- Event: "${event.title}" (${event.eventType})
- Date: ${event.date}
- Guest Count: ${event.guestCount}
- Budget: ${event.currency}${event.totalBudget}
- Vibe: "${event.vibe}"

Provide specific, practical, creative advice. Use bullet points, clear actionable tips, and maintain a calm, reassuring, enthusiastic tone.
`;
      const historyContext = chatHistory.slice(-4).map(h => `${h.role}: ${h.content}`).join('\n');
      const prompt = `${historyContext}\nUser: ${userQuery}\nAssistant:`;

      const reply = await callGeminiRaw(prompt, apiKey, systemPrompt);
      return { text: reply };
    } catch (err) {
      console.warn('Gemini Chat failed, falling back to intelligent simulation', err);
    }
  }

  // Built-in intelligent semantic response engine
  const q = userQuery.toLowerCase();
  
  if (q.includes('budget') || q.includes('save') || q.includes('cut') || q.includes('cost') || q.includes('expensive')) {
    const totalCommitted = event.budgetItems.reduce((acc, i) => acc + (i.actualCost > 0 ? i.actualCost : i.estimatedCost), 0);
    const diff = event.totalBudget - totalCommitted;
    const isOver = diff < 0;

    return {
      text: `### 💡 Smart Budget Optimization for **${event.title}**

Currently, your total committed expenses are **${event.currency}${totalCommitted.toLocaleString()}** against your total budget of **${event.currency}${event.totalBudget.toLocaleString()}** (${isOver ? `⚠️ Over by ${event.currency}${Math.abs(diff).toLocaleString()}` : `✅ Under budget by ${event.currency}${diff.toLocaleString()}`}).

Here are 4 high-impact ways to trim costs without sacrificing guest experience:

1. **Optimize Alcohol & Bar Strategy**:
   - Instead of an unlimited open top-shelf liquor bar, offer 2 signature cocktails + local craft beer & house wines. This typically reduces beverage expense by **25% to 35%**.
2. **Repurpose Ceremony Florals for the Reception**:
   - Have your coordinator move the ceremony arch arrangements to frame your dinner sweetheart/head table during cocktail hour. You get double value from single floral pieces!
3. **Switch to Digital Save-the-Dates & Letterpress Main Suite**:
   - Save \$300–\$600 on printing postage by sending digital save-the-dates via paperless invites, reserving luxury paper print only for the official invitation suite.
4. **Choose In-Season Regional Flowers**:
   - Ask your florist for "palette-inspired seasonal blooms" rather than rigid specific varieties. Substituting imported out-of-season peonies with garden roses can save hundreds.`,
      actionSuggestions: [
        { label: 'Add Contingency Reserve Item', actionType: 'add_expense', payload: { category: 'Contingency & Emergency Reserve', name: 'Buffer Reserve (5%)', estimatedCost: Math.round(event.totalBudget * 0.05) } },
        { label: 'Copy Budget Advice', actionType: 'copy_text' }
      ]
    };
  }

  if (q.includes('vendor') || q.includes('email') || q.includes('inquiry') || q.includes('question') || q.includes('rfp')) {
    return {
      text: `### ✉️ Tailored Vendor Inquiry & RFP Draft

Here is a polished inquiry message ready to send to prospective vendors for **${event.title}**:

\`\`\`text
Subject: Vendor Inquiry: ${event.eventType.toUpperCase()} on ${event.date} (${event.guestCount} guests)

Hi [Vendor Name / Team],

I hope this message finds you well!

We are planning our upcoming ${event.eventType}, "${event.title}", scheduled for ${event.date} at ${event.location || '[Venue Location]'}. We admire your work and would love to check your availability.

Here are a few quick details about our vision:
- Expected Guests: ~${event.guestCount}
- Vision & Style: ${event.vibe}
- Target Budget Allocation: Approximately ${event.currency}${Math.round(event.totalBudget * 0.15).toLocaleString()}

Could you please share your service packages, pricing guide, and whether you are available on ${event.date}? We'd also love to know if you offer an initial consultation call.

Thank you so much, and we look forward to hearing from you!

Warm regards,
[Your Name]
[Your Phone Number]
\`\`\`

**Top 3 Questions to Ask Before Signing:**
- Are there any hidden fees (overtime rates, travel fees, breakdown surcharges)?
- What is your deposit schedule and refund/cancellation policy?
- Do you carry comprehensive general liability insurance?`,
      actionSuggestions: [
        { label: 'Copy Email to Clipboard', actionType: 'copy_text' }
      ]
    };
  }

  if (q.includes('rain') || q.includes('weather') || q.includes('contingency') || q.includes('plan b')) {
    return {
      text: `### ☔ Weather Contingency & "Plan B" Playbook

Don't let unexpected weather dampen your celebration! Here is your 4-step emergency readiness protocol for **${event.title}**:

1. **The 72-Hour Weather Decision Trigger**:
   - Establish a firm cutoff with your venue and rental company (usually 72 to 48 hours before the event) to trigger tent delivery or shift indoor seating without incurring double setup fees.
2. **Clear Umbrella Photo Magic**:
   - Purchase 15–20 transparent bubble umbrellas in bulk ($8–$12 each). Wet pavement and raindrops under bistro lights actually produce breathtaking, reflective editorial photos!
3. **Guest Comfort Station**:
   - For rain: Basket of dry rolled fleece blankets, towel baskets at restrooms, and shoe wipes.
   - For unexpected heat: Custom handheld wooden fans (doubling as programs) and an iced hydration station with cucumber-mint water.
4. **Electrical & Sound Protection**:
   - Ensure the DJ/band has waterproof heavy tarps and GFCI surge protected outlets ready under canopies.`,
      actionSuggestions: [
        { label: 'Add Weather Backup to Timeline', actionType: 'add_timeline', payload: { phase: 'week_of', timeLabel: '3 Days Prior', title: 'Confirm Weather Contingency Decision', category: 'Logistics' } }
      ]
    };
  }

  if (q.includes('speech') || q.includes('toast') || q.includes('vow') || q.includes('words')) {
    return {
      text: `### 🎤 Heartfelt 2-Minute Toast / Speech Template

Here is a universally acclaimed 4-beat speech formula that balances warmth, humor, and sincere emotion:

1. **The Hook & Greeting (30 seconds)**:
   > *"Good evening everyone! For those who don't know me, my name is [Name], and I've had the immense honor of knowing [Honoree/Couple] for [Number] years..."*
2. **A Revealing & Humorous Micro-Story (45 seconds)**:
   > *Share one specific anecdote illustrating their character — e.g., how they always show up with homemade cookies when someone is stressed, or their relentless optimism.*
3. **The Pivot to Deep Gratitude (30 seconds)**:
   > *"What makes today so special isn't just the gorgeous setting, but looking around this room and seeing all the love that [Names] have cultivated throughout their lives..."*
4. **The Final Toast (15 seconds)**:
   > *"So please raise your glasses with me. To love, to shared adventures, and to many more nights like tonight. Cheers!"*

**Pro Tip:** Keep it under 3 minutes total. Speak 20% slower than you think you need to!`,
      actionSuggestions: [
        { label: 'Copy Speech Template', actionType: 'copy_text' }
      ]
    };
  }

  // Default helpful response
  return {
    text: `### 🌟 PlanBot Ideas for **${event.title}**

I'm ready to help you coordinate every detail of your **${event.eventType}**! Here are a few things we can do right now:

- **Review Vendor Checklists**: Generate tailored vetting questions or draft introductory emails.
- **Budget Health Check**: Analyze your budget distribution to ensure you have a healthy buffer.
- **Run-of-Show Refinement**: Adjust day-of timeline slots so your guests never feel rushed.
- **Thematic Creative Touches**: Brainstorm memorable icebreakers, signature cocktails, or sustainable decor ideas matching your palette (**${event.colorPalette.map(c => c.name).join(', ')}**).

What would you like to explore next? Feel free to ask about budget trimming, rain contingencies, guest list etiquette, or day-of logistics!`,
    actionSuggestions: [
      { label: 'How can I trim 15% from catering?', actionType: 'add_idea' },
      { label: 'Suggest rain contingency plan', actionType: 'add_timeline' }
    ]
  };
}

export function generateMoreIdeas(category: string, event: EventPlan): IdeaItem[] {
  const timestamp = Date.now();
  const c = category.toLowerCase();

  if (c.includes('food') || c.includes('drink')) {
    return [
      {
        id: `idea-extra-${timestamp}-1`,
        category: 'food_drinks',
        title: 'Artisanal Grazing Table with Local Honeycomb',
        description: 'A 10-foot lush grazing spread featuring regional cheeses, fig preserves, fresh sourdough crisps, and whole honeycomb dripping onto marble boards.',
        tags: ['Gourmet', 'Visual Wow', 'Cocktail Hour'],
        costImpact: 'medium',
        difficulty: 'moderate',
        bookmarked: false,
        aiSuggestedReason: `Fits naturally with the ${event.vibe} aesthetic and keeps guests entertained during arrival.`
      },
      {
        id: `idea-extra-${timestamp}-2`,
        category: 'food_drinks',
        title: 'Interactive Cold Brew & Affogato Cart',
        description: 'A mini mobile wooden cart serving espresso poured over gourmet vanilla bean and salted caramel gelato scoops for an afternoon or post-dinner boost.',
        tags: ['Dessert', 'Interactive', 'Summer/Evening'],
        costImpact: 'low',
        difficulty: 'easy',
        bookmarked: false,
        aiSuggestedReason: 'Beloved alternative to traditional sheet cakes that guests talk about for months.'
      }
    ];
  }

  if (c.includes('entertain') || c.includes('game') || c.includes('interactive')) {
    return [
      {
        id: `idea-extra-${timestamp}-3`,
        category: 'interactive',
        title: 'Custom "Time Capsule" Envelope Vault',
        description: 'Provide mini stamped kraft envelopes with prompt cards where guests write predictions and notes for the host/couple to open on their 1st, 5th, and 10th anniversaries.',
        tags: ['Sentimental', 'Keepsake', 'Low Cost'],
        costImpact: 'low',
        difficulty: 'easy',
        bookmarked: false,
        aiSuggestedReason: 'Costs under $25 to assemble and creates priceless future memories.'
      },
      {
        id: `idea-extra-${timestamp}-4`,
        category: 'entertainment',
        title: 'Live Event Watercolorist / Sketch Artist',
        description: 'Hire a local illustrator to sketch 5-minute custom guest fashion portraits on textured cardstock that attendees take home as personalized artwork.',
        tags: ['Artistic', 'Favors', 'High Impact'],
        costImpact: 'medium',
        difficulty: 'moderate',
        bookmarked: false,
        aiSuggestedReason: 'Serves as entertainment during cocktails AND doubles as high-end guest favors!'
      }
    ];
  }

  return [
    {
      id: `idea-extra-${timestamp}-5`,
      category: 'sustainability',
      title: 'Solar Fairy Light Pathway Illumination',
      description: 'Line the pedestrian walkway and garden paths with warm 2700K solar glass lanterns and copper micro-strands that softly glow automatically as twilight arrives.',
      tags: ['Eco-friendly', 'Atmosphere', 'Safety'],
      costImpact: 'low',
      difficulty: 'easy',
      bookmarked: false,
      aiSuggestedReason: 'Provides romantic magical ambience without needing long extension cords or generator power.'
    },
    {
      id: `idea-extra-${timestamp}-6`,
      category: 'decor',
      title: 'Personalized Botanical Escort Tile Cards',
      description: 'Hand-written calligraphy on natural terracotta or slate tiles adorned with a fresh rosemary or olive sprig, guiding guests to their tables.',
      tags: ['Handmade', 'Earthy', 'Keepsake'],
      costImpact: 'low',
      difficulty: 'moderate',
      bookmarked: false,
      aiSuggestedReason: 'Complements your color palette and gives guests a tactile personalized keepsake.'
    }
  ];
}
