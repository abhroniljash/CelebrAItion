import { EventPlan } from '../types';

export const SEED_EVENTS: EventPlan[] = [
  {
    id: 'seed-wedding-1',
    title: "Aria & Julian's Coastal Olive Grove Wedding",
    eventType: 'wedding',
    date: '2026-09-18',
    time: '15:30',
    location: 'Sunstone Estate & Vineyards, Santa Ynez, CA',
    guestCount: 120,
    totalBudget: 38000,
    currency: '$',
    vibe: 'Warm Mediterranean Romance, Tuscan Textures & Golden Hour Glow',
    themeDescription: 'An intimate, organic open-air celebration blending wild olive foliage, neutral linen textures, candlelight groves, and artisanal Mediterranean farm-to-table dining under bistro string lighting.',
    dressCode: 'Elevated Garden Cocktail / Summer Formal in Soft Earth Tones',
    colorPalette: [
      { name: 'Olive Leaf', hex: '#586A4C', role: 'Primary Foliage Accent' },
      { name: 'Warm Terracotta', hex: '#C86D51', role: 'Warm Earth Tone' },
      { name: 'Golden Champagne', hex: '#E5C158', role: 'Metallic Glow & Brass' },
      { name: 'Linen Sand', hex: '#EBE4D8', role: 'Neutral Tablecloth & Drapery' },
      { name: 'Sunken Fig', hex: '#4A2835', role: 'Rich Contrast Floral' },
    ],
    budgetItems: [
      {
        id: 'b-w-1',
        category: 'Venue & Rentals',
        name: 'Sunstone Estate Venue Rental & Vineyard Lawn',
        estimatedCost: 11000,
        actualCost: 11000,
        paidAmount: 6000,
        status: 'deposit_paid',
        priority: 'essential',
        notes: 'Includes lawn ceremony space, stone courtyard, bridal suite access from 9:00 AM'
      },
      {
        id: 'b-w-2',
        category: 'Catering & Beverages',
        name: 'Artisan Wood-Fired Catering & Passed Hors d\'oeuvres',
        estimatedCost: 9600,
        actualCost: 9850,
        paidAmount: 4000,
        status: 'deposit_paid',
        priority: 'essential',
        notes: '$78/person + 20% gratuity. 3-course seasonal plated dinner with local wine pairings'
      },
      {
        id: 'b-w-3',
        category: 'Catering & Beverages',
        name: 'Signature Bar & Local Vineyard Wine Service',
        estimatedCost: 2400,
        actualCost: 2200,
        paidAmount: 2200,
        status: 'paid',
        priority: 'essential',
        notes: '2 signature cocktails (Fig Bourbon Smash & Rosemary Gin Fizz) + beer and wine'
      },
      {
        id: 'b-w-4',
        category: 'Photography & Videography',
        name: '8-Hour Golden Hour Dual Photography Package',
        estimatedCost: 4200,
        actualCost: 4000,
        paidAmount: 2000,
        status: 'deposit_paid',
        priority: 'essential',
        notes: 'Includes online gallery, engagement session, high-res prints, second shooter'
      },
      {
        id: 'b-w-5',
        category: 'Decor, Florals & Lighting',
        name: 'Organic Olive Branches, Table Runners & Ceremony Arch',
        estimatedCost: 3500,
        actualCost: 3600,
        paidAmount: 1800,
        status: 'deposit_paid',
        priority: 'recommended',
        notes: 'Minimalist eucalyptus, olive boughs, garden roses, 120 pillar glass candles'
      },
      {
        id: 'b-w-6',
        category: 'Entertainment, Music & AV',
        name: 'Acoustic Guitar Ceremony Duo & Reception DJ/MC',
        estimatedCost: 2600,
        actualCost: 2600,
        paidAmount: 1300,
        status: 'deposit_paid',
        priority: 'recommended',
        notes: 'Ceremony spanish guitar, wireless lapel mics, full evening dance floor lighting'
      },
      {
        id: 'b-w-7',
        category: 'Attire, Beauty & Rings',
        name: 'Bridal Alterations & Groom Custom Suit',
        estimatedCost: 2200,
        actualCost: 1950,
        paidAmount: 1950,
        status: 'paid',
        priority: 'essential',
        notes: 'Alterations completed; groom linen-blend forest suit tailored'
      },
      {
        id: 'b-w-8',
        category: 'Invitations, Favors & Signage',
        name: 'Letterpress Suite, Calligraphy Escort Cards & Olive Oil Favors',
        estimatedCost: 1100,
        actualCost: 950,
        paidAmount: 950,
        status: 'paid',
        priority: 'recommended',
        notes: 'Mini estate cold-pressed olive oil bottles with custom stamped wax tags'
      },
      {
        id: 'b-w-9',
        category: 'Contingency & Emergency Reserve',
        name: 'Weather Contingency & Unexpected Overage Buffer',
        estimatedCost: 1400,
        actualCost: 0,
        paidAmount: 0,
        status: 'planned',
        priority: 'essential',
        notes: 'Reserved for last-minute heater rentals if vineyard evening turns brisk'
      }
    ],
    timelineItems: [
      {
        id: 't-w-1',
        phase: 'planning_early',
        timeLabel: '9 Months Prior',
        title: 'Lock Venue & Set Official Guest Capacity',
        description: 'Finalize Sunstone contract, pay initial deposit, book room blocks for out-of-town guests.',
        category: 'Venue',
        completed: true,
        isKeyMilestone: true
      },
      {
        id: 't-w-2',
        phase: 'planning_mid',
        timeLabel: '4 Months Prior',
        title: 'Tasting Session & Menu Sign-Off',
        description: 'Select final menu items, confirm vegetarian/gluten-free options, finalize bar cocktail recipes.',
        category: 'Catering',
        completed: true,
        isKeyMilestone: true
      },
      {
        id: 't-w-3',
        phase: 'planning_late',
        timeLabel: '3 Weeks Prior',
        title: 'Final RSVP Headcount & Seating Chart',
        description: 'Submit final plate count to caterer. Finalize table layout and calligraphy escort cards.',
        category: 'Guests',
        completed: false,
        isKeyMilestone: true
      },
      {
        id: 't-w-4',
        phase: 'week_of',
        timeLabel: '2 Days Prior',
        title: 'Rehearsal Walkthrough & Welcome Dinner',
        description: 'Walk through processional order at venue with wedding party. Casual wood-fired pizza welcome dinner.',
        category: 'Ceremony',
        completed: false
      },
      {
        id: 't-w-5',
        phase: 'day_of',
        timeLabel: '09:30 AM',
        title: 'Bridal Suite Hair & Makeup Prep',
        description: 'Hair and makeup artist arrives; bridal party champagne toast and mimosa bar.',
        category: 'Preparation',
        completed: false
      },
      {
        id: 't-w-6',
        phase: 'day_of',
        timeLabel: '13:30 PM',
        title: 'Photographer Arrives & Details Flat Lays',
        description: 'Photograph dress, invitations, rings, and florals before first look.',
        category: 'Photography',
        completed: false
      },
      {
        id: 't-w-7',
        phase: 'day_of',
        timeLabel: '14:30 PM',
        title: 'Couple\'s First Look in Olive Grove',
        description: 'Intimate first look amongst century-old olive trees followed by couple portraits.',
        category: 'Photography',
        completed: false,
        isKeyMilestone: true
      },
      {
        id: 't-w-8',
        phase: 'day_of',
        timeLabel: '15:30 PM',
        title: 'Guest Arrival & Welcome Spritz',
        description: 'Guests arrive to acoustic Spanish guitar; sparkling elderflower spritz served.',
        category: 'Hospitality',
        completed: false
      },
      {
        id: 't-w-9',
        phase: 'day_of',
        timeLabel: '16:00 PM',
        title: 'Ceremony Commences',
        description: 'Processional begins; custom vows exchanged under the arch.',
        category: 'Ceremony',
        completed: false,
        isKeyMilestone: true
      },
      {
        id: 't-w-10',
        phase: 'day_of',
        timeLabel: '17:00 PM',
        title: 'Cocktail Hour & Golden Hour Sunset Photos',
        description: 'Passed bites, signature bar opens; couple takes golden hour vineyard portraits.',
        category: 'Reception',
        completed: false
      },
      {
        id: 't-w-11',
        phase: 'day_of',
        timeLabel: '18:30 PM',
        title: 'Grand Entrance & Plated Dinner',
        description: 'Welcome toast by best man & maid of honor, seasonal Italian family-style feast.',
        category: 'Reception',
        completed: false,
        isKeyMilestone: true
      },
      {
        id: 't-w-12',
        phase: 'day_of',
        timeLabel: '20:15 PM',
        title: 'First Dance & Dance Floor Celebration',
        description: 'First dance to "Beyond" by Leon Bridges, followed by high-energy dance party.',
        category: 'Music',
        completed: false
      },
      {
        id: 't-w-13',
        phase: 'day_of',
        timeLabel: '22:30 PM',
        title: 'Sparkler Farewell & Shuttles',
        description: 'Sparkler archway send-off for couple; private shuttles transport guests back to hotel.',
        category: 'Send-Off',
        completed: false
      }
    ],
    vendors: [
      {
        id: 'v-w-1',
        category: 'Venue',
        name: 'Sunstone Estate & Vineyards',
        contactPerson: 'Elena Rostova',
        email: 'events@sunstonevineyard.com',
        phone: '(805) 555-0192',
        website: 'https://sunstonevineyard.com',
        quoteAmount: 11000,
        depositPaid: 6000,
        status: 'booked',
        rating: 5,
        notes: 'Confirmed exclusivity for the afternoon/evening. Curfew is 11:00 PM.',
        keyQuestionsToAsk: [
          'What is the sound decibel restriction after 10 PM?',
          'Is liability insurance required for all external catering staff?',
          'What is the backup rain space capacity if outdoor lawn cannot be used?'
        ]
      },
      {
        id: 'v-w-2',
        category: 'Photography',
        name: 'Lumière & Stone Wedding Photography',
        contactPerson: 'Marcus Vance',
        email: 'marcus@lumiereandstone.com',
        phone: '(310) 555-7381',
        website: 'https://lumiereandstone.com',
        quoteAmount: 4000,
        depositPaid: 2000,
        status: 'booked',
        rating: 5,
        notes: 'Specializes in natural golden hour light and 35mm film candids.',
        keyQuestionsToAsk: [
          'How many edited photos are delivered and what is the turnaround time?',
          'Will you do a location walkthrough before the wedding day?',
          'Are raw uncompressed files available upon request?'
        ]
      },
      {
        id: 'v-w-3',
        category: 'Catering & Bar',
        name: 'Terra Cotta Culinary Artisans',
        contactPerson: 'Chef Mateo Cruz',
        email: 'mateo@terracottacatering.com',
        phone: '(805) 555-3849',
        website: 'https://terracottacatering.com',
        quoteAmount: 9850,
        depositPaid: 4000,
        status: 'booked',
        rating: 4,
        notes: 'Includes all table service staff, water goblets, and flatware.',
        keyQuestionsToAsk: [
          'Do you handle dietary requirements (celiac, vegan) with separate plating?',
          'Is cake cutting and coffee service included in the fee?',
          'What happens to leftover food at the end of the evening?'
        ]
      },
      {
        id: 'v-w-4',
        category: 'Florist & Decor',
        name: 'Wild Olive & Bloom Floral Co.',
        contactPerson: 'Chloe Laurent',
        email: 'chloe@wildolivebloom.com',
        phone: '(805) 555-8291',
        website: 'https://wildolivebloom.com',
        quoteAmount: 3600,
        depositPaid: 1800,
        status: 'booked',
        rating: 5,
        notes: 'Focusing on zero floral foam, sustainable local greenery, and reusable urns.',
        keyQuestionsToAsk: [
          'Do you handle teardown at the end of the night or next morning?',
          'Can ceremony arch florals be repurposed for the sweetheart table?',
          'What happens if certain seasonal flowers are unavailable?'
        ]
      },
      {
        id: 'v-w-5',
        category: 'DJ & Live Band',
        name: 'Soundwave Collective (DJ Kai + Saxophone)',
        contactPerson: 'Kai Bennett',
        email: 'booking@soundwavecollective.com',
        phone: '(213) 555-4019',
        website: 'https://soundwavecollective.com',
        quoteAmount: 2600,
        depositPaid: 1300,
        status: 'booked',
        rating: 5,
        notes: 'Includes live saxophone accompaniment during cocktail hour and sunset.',
        keyQuestionsToAsk: [
          'Do you supply wireless microphones for the ceremony officiant and speeches?',
          'Can we submit a strict "Do Not Play" blacklist?',
          'What is your equipment power requirement at the lawn ceremony?'
        ]
      }
    ],
    ideas: [
      {
        id: 'i-w-1',
        category: 'favors',
        title: 'Infused Estate Olive Oil & Rosemary Favors',
        description: 'Mini glass bottles of cold-pressed California olive oil infused with estate rosemary sprigs, sealed in forest green wax with guest names hand-lettered on linen tags.',
        tags: ['Handmade', 'Culinary', 'Eco-friendly', 'Memorable'],
        costImpact: 'low',
        difficulty: 'easy',
        bookmarked: true,
        aiSuggestedReason: 'Pairs seamlessly with your Tuscan Vineyard theme and doubles as elegant place cards!'
      },
      {
        id: 'i-w-2',
        category: 'interactive',
        title: 'Vintage Audio Guestbook via Rotary Telephone',
        description: 'Set up a restored 1970s cream rotary phone where guests pick up the receiver, hear a recorded welcome from the couple, and leave voice messages, laughter, and advice.',
        tags: ['Nostalgic', 'Audio', 'Interactive', 'Sentimental'],
        costImpact: 'low',
        difficulty: 'easy',
        bookmarked: true,
        aiSuggestedReason: 'Captures authentic voices, hilarious late-night toasts, and emotional messages you can listen to every anniversary.'
      },
      {
        id: 'i-w-3',
        category: 'food_drinks',
        title: 'Midnight Wood-Fired Neapolitan Pizza Delivery',
        description: 'At 10:00 PM, bring out fresh piping hot truffle mushroom and margherita pizza slices in mini stamped kraft boxes to refuel the dancing crowd.',
        tags: ['Late Night', 'Crowd Pleaser', 'Comfort Food'],
        costImpact: 'medium',
        difficulty: 'easy',
        bookmarked: false,
        aiSuggestedReason: 'One of the most praised guest surprises that prevents early departures and keeps high energy.'
      },
      {
        id: 'i-w-4',
        category: 'decor',
        title: 'Hanging Canopy of Warm Edison Bulbs & Olive Garlands',
        description: 'Suspend low-hanging bistro fairy strands intertwined with olive branches over long banquet tables to create an intimate outdoor ballroom under the stars.',
        tags: ['Lighting', 'Atmospheric', 'Romantic'],
        costImpact: 'medium',
        difficulty: 'moderate',
        bookmarked: true,
        aiSuggestedReason: 'Transforms large open vineyard space into a cozy candlelit sanctuary as the sun sets.'
      },
      {
        id: 'i-w-5',
        category: 'sustainability',
        title: 'Floral Repurposing & Morning-After Flower Drop-Off',
        description: 'Coordinate with a local nursing home or hospice to donate all table centerpieces and bouquets the following morning so flowers bring joy twice.',
        tags: ['Community', 'Zero Waste', 'Charity'],
        costImpact: 'low',
        difficulty: 'easy',
        bookmarked: true,
        aiSuggestedReason: 'Eliminates floral waste while spreading kindness in the local Santa Ynez community.'
      }
    ],
    guests: [
      { id: 'g-w-1', name: 'Julian Vance & Guest', partySize: 2, status: 'attending', dietaryRestrictions: 'None', groupTag: 'Family', tableNumber: 'Table 1' },
      { id: 'g-w-2', name: 'Aria Montgomery & Guest', partySize: 2, status: 'attending', dietaryRestrictions: 'Vegetarian', groupTag: 'Family', tableNumber: 'Table 1' },
      { id: 'g-w-3', name: 'David & Claire Sterling', partySize: 2, status: 'attending', dietaryRestrictions: 'Gluten-Free (Claire)', groupTag: 'Bridal Party', tableNumber: 'Table 2' },
      { id: 'g-w-4', name: 'Dr. Evelyn Morales', partySize: 1, status: 'attending', dietaryRestrictions: 'Vegan', groupTag: 'College Friends', tableNumber: 'Table 4' },
      { id: 'g-w-5', name: 'Liam & Sophia Chen', partySize: 2, status: 'pending', dietaryRestrictions: 'None', groupTag: 'Work Colleagues', tableNumber: 'Table 6' },
      { id: 'g-w-6', name: 'Marcus Brody', partySize: 1, status: 'declined', dietaryRestrictions: 'None', groupTag: 'College Friends' },
    ],
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-02-15T14:30:00.000Z'
  },
  {
    id: 'seed-birthday-2',
    title: "Leo's Retro Synthwave 30th Birthday Bash",
    eventType: 'birthday',
    date: '2026-11-14',
    time: '19:00',
    location: 'Neon District Loft & Rooftop Arcade, Austin, TX',
    guestCount: 50,
    totalBudget: 5500,
    currency: '$',
    vibe: '80s Outrun, Retro Synthwave Neon, High-Score Arcades & Craft Cocktails',
    themeDescription: 'A pulsating 80s cyberpunk & retrowave rooftop celebration featuring classic arcade cabinets, vaporwave vinyl beats, smoky molecular cocktails, and retro laser photo booths.',
    dressCode: '80s Glam, Cyberpunk Chic, Bold Leather & Neon Accents',
    colorPalette: [
      { name: 'Cyber Magenta', hex: '#FF007F', role: 'Primary Neon Glow' },
      { name: 'Electric Cyan', hex: '#00F0FF', role: 'Secondary Neon Contrast' },
      { name: 'Ultraviolet Purple', hex: '#7928CA', role: 'Deep Ambient Backlight' },
      { name: 'Sunset Grid Orange', hex: '#FF6B35', role: 'Warm Retro Accent' },
      { name: 'Onyx Black', hex: '#111827', role: 'Dark Space Foundation' },
    ],
    budgetItems: [
      {
        id: 'b-b-1',
        category: 'Venue & Rentals',
        name: 'Skyline Neon Loft & Rooftop Lounge Rental',
        estimatedCost: 1800,
        actualCost: 1800,
        paidAmount: 900,
        status: 'deposit_paid',
        priority: 'essential',
        notes: '6 hours rooftop and indoor loft access with sound system included'
      },
      {
        id: 'b-b-2',
        category: 'Venue & Rentals',
        name: 'Vintage Arcade Cabinet Rentals (Pac-Man, Street Fighter II, Galaga)',
        estimatedCost: 750,
        actualCost: 700,
        paidAmount: 700,
        status: 'paid',
        priority: 'recommended',
        notes: '3 full-size upright cabinets on free-play mode for tournament'
      },
      {
        id: 'b-b-3',
        category: 'Catering & Beverages',
        name: 'Gourmet Slider Bar & Korean Fusion Street Food',
        estimatedCost: 1400,
        actualCost: 1350,
        paidAmount: 500,
        status: 'deposit_paid',
        priority: 'essential',
        notes: 'Bao buns, wagyu sliders, kimchi fries, vegetarian jackfruit sliders'
      },
      {
        id: 'b-b-4',
        category: 'Catering & Beverages',
        name: 'Molecular Mixologist & Glowing Neon Cocktails',
        estimatedCost: 800,
        actualCost: 850,
        paidAmount: 400,
        status: 'deposit_paid',
        priority: 'recommended',
        notes: 'Dry-ice smoked "Blade Runner Old Fashioned" & "Electric Blue Lagoon"'
      },
      {
        id: 'b-b-5',
        category: 'Decor, Florals & Lighting',
        name: 'Custom Neon LED Sign ("Level 30 Unlocked") & UV Uplights',
        estimatedCost: 450,
        actualCost: 420,
        paidAmount: 420,
        status: 'paid',
        priority: 'recommended',
        notes: 'Neon sign can be kept as home decor after party!'
      },
      {
        id: 'b-b-6',
        category: 'Entertainment, Music & AV',
        name: 'Live Chiptune & Synthwave Vinyl DJ',
        estimatedCost: 600,
        actualCost: 600,
        paidAmount: 300,
        status: 'deposit_paid',
        priority: 'essential',
        notes: 'Spinning Kavinsky, Daft Punk, Carpenter Brut, 80s new wave'
      }
    ],
    timelineItems: [
      {
        id: 't-b-1',
        phase: 'planning_mid',
        timeLabel: '6 Weeks Prior',
        title: 'Book Arcade Cabinets & DJ',
        description: 'Secure Street Fighter II & Galaga machines, lock DJ Kai playlist requirements.',
        category: 'Entertainment',
        completed: true,
        isKeyMilestone: true
      },
      {
        id: 't-b-2',
        phase: 'planning_late',
        timeLabel: '2 Weeks Prior',
        title: 'Design Custom Cocktail Menu & Neon Badges',
        description: 'Finalize drink ingredients and test dry ice safety protocols.',
        category: 'Bar',
        completed: true
      },
      {
        id: 't-b-3',
        phase: 'day_of',
        timeLabel: '17:00 PM',
        title: 'Loft Load-in & Lighting Rig Setup',
        description: 'Place arcade machines, configure UV blacklights and fog machine, test DJ acoustics.',
        category: 'Logistics',
        completed: false
      },
      {
        id: 't-b-4',
        phase: 'day_of',
        timeLabel: '19:00 PM',
        title: 'Doors Open & Welcome Glowing Cocktails',
        description: 'Guests arrive, receive LED wristbands and collectible game tokens; synth ambient music playing.',
        category: 'Party',
        completed: false,
        isKeyMilestone: true
      },
      {
        id: 't-b-5',
        phase: 'day_of',
        timeLabel: '20:30 PM',
        title: 'Street Fighter II High-Score Tournament',
        description: 'Bracket tournament on projected wall screen; winner takes home retro golden trophy.',
        category: 'Game',
        completed: false,
        isKeyMilestone: true
      },
      {
        id: 't-b-6',
        phase: 'day_of',
        timeLabel: '22:00 PM',
        title: 'Level 30 Cake Cutting & DJ Peak Dance Set',
        description: 'Pixelated 8-bit birthday cake cutting with sparkling candle flares, then full dance mode.',
        category: 'Celebration',
        completed: false,
        isKeyMilestone: true
      }
    ],
    vendors: [
      {
        id: 'v-b-1',
        category: 'Venue',
        name: 'The Neon Grid Loft Austin',
        contactPerson: 'Zane Gallagher',
        email: 'info@theneongrid.com',
        phone: '(512) 555-9021',
        website: 'https://theneongridaustin.com',
        quoteAmount: 1800,
        depositPaid: 900,
        status: 'booked',
        rating: 5,
        notes: 'Includes rooftop terrace with panoramic downtown views.',
        keyQuestionsToAsk: [
          'Can we use safe water-based haze/fog machines?',
          'Is elevator access available for moving heavy arcade machines?',
          'What is the cleanup deadline at night?'
        ]
      },
      {
        id: 'v-b-2',
        category: 'Rentals & Furniture',
        name: 'RetroCade Machine Rentals',
        contactPerson: 'Sam Kowalski',
        email: 'rentals@retrocadeatx.com',
        phone: '(512) 555-8320',
        website: 'https://retrocadeatx.com',
        quoteAmount: 700,
        depositPaid: 700,
        status: 'booked',
        rating: 5,
        notes: 'Delivery and pickup included at 16:30 and 01:30.',
        keyQuestionsToAsk: [
          'Are coin slots set to free play or token operation?',
          'Do cabinets come with surge protectors?'
        ]
      }
    ],
    ideas: [
      {
        id: 'i-b-1',
        category: 'interactive',
        title: '8-Bit Bracket Tournament with Retro Golden Trophy',
        description: 'A 16-player knockout tournament on Street Fighter II with live witty commentary by friends and a hilarious oversized gold plastic champion belt.',
        tags: ['Competitive', 'High Energy', 'Retro'],
        costImpact: 'low',
        difficulty: 'easy',
        bookmarked: true,
        aiSuggestedReason: 'Gets everyone cheering, laughing, and invested right before the cake cutting!'
      },
      {
        id: 'i-b-2',
        category: 'food_drinks',
        title: 'Color-Changing Butterfly Pea Flower Welcome Punch',
        description: 'Brew blue butterfly pea flower tea with gin; when guests add a splash of lemon juice dropper, it instantly turns fluorescent purple-pink under UV light.',
        tags: ['DIY Science', 'Cocktail', 'Visual WOW'],
        costImpact: 'low',
        difficulty: 'easy',
        bookmarked: true,
        aiSuggestedReason: 'Looks like real-life cyberpunk alchemy at virtually zero extra cost.'
      },
      {
        id: 'i-b-3',
        category: 'favors',
        title: 'Custom Mixtape USB Cassette Tapes',
        description: 'A USB drive housed inside a transparent 80s audio cassette shell loaded with the birthday playlist, digital photo gallery link, and thank you note.',
        tags: ['Souvenir', 'Music', 'Collectible'],
        costImpact: 'medium',
        difficulty: 'moderate',
        bookmarked: false,
        aiSuggestedReason: 'Super thematic party favor that guests will actually display on their desks.'
      }
    ],
    guests: [
      { id: 'g-b-1', name: 'Leo Vance (Birthday Star)', partySize: 1, status: 'attending', groupTag: 'VIP' },
      { id: 'g-b-2', name: 'Maya Lin', partySize: 2, status: 'attending', dietaryRestrictions: 'Vegetarian', groupTag: 'Close Friends' },
      { id: 'g-b-3', name: 'Derrick O\'Connor', partySize: 1, status: 'attending', dietaryRestrictions: 'None', groupTag: 'Gaming Crew' },
      { id: 'g-b-4', name: 'Samantha Wu', partySize: 2, status: 'attending', dietaryRestrictions: 'Gluten-Free', groupTag: 'Close Friends' },
      { id: 'g-b-5', name: 'Tariq Al-Mansoor', partySize: 1, status: 'pending', groupTag: 'Work Colleagues' },
    ],
    createdAt: '2026-02-01T12:00:00.000Z',
    updatedAt: '2026-02-18T10:15:00.000Z'
  },
  {
    id: 'seed-community-3',
    title: "Oakridge Annual Harvest & Lantern Festival",
    eventType: 'community',
    date: '2026-10-24',
    time: '14:00',
    location: 'Oakridge Community Park & Amphitheater',
    guestCount: 350,
    totalBudget: 12500,
    currency: '$',
    vibe: 'Warm Autumn Community, Artisan Food Trucks, Live Folk Music & Floating Lantern Walk',
    themeDescription: 'A multi-generational neighborhood festival celebrating autumn bounty with local artisan craft booths, pumpkin carving contests, cider tasting, acoustic bluegrass, and an evening twilight paper lantern procession.',
    dressCode: 'Cozy Flannels, Autumn Knits & Comfortable Walking Shoes',
    colorPalette: [
      { name: 'Harvest Pumpkin', hex: '#E06D28', role: 'Warm Autumn Hero' },
      { name: 'Golden Marigold', hex: '#F3B538', role: 'Festive Accent' },
      { name: 'Deep Moss Green', hex: '#3B5838', role: 'Park & Nature Anchor' },
      { name: 'Warm Cinnamon', hex: '#873B25', role: 'Cozy Earth Tone' },
      { name: 'Twilight Navy', hex: '#1C2942', role: 'Evening Lantern Sky' },
    ],
    budgetItems: [
      {
        id: 'b-c-1',
        category: 'Permits, Insurance & Logistics',
        name: 'City Park Permit, Sound Variance & Liability Insurance',
        estimatedCost: 1500,
        actualCost: 1450,
        paidAmount: 1450,
        status: 'paid',
        priority: 'essential',
        notes: 'Permits granted through Oakridge Parks & Rec department'
      },
      {
        id: 'b-c-2',
        category: 'Venue & Rentals',
        name: 'Pop-Up Tents, Folding Tables, Generator & Portable Restrooms',
        estimatedCost: 3200,
        actualCost: 3100,
        paidAmount: 1500,
        status: 'deposit_paid',
        priority: 'essential',
        notes: '15 craft vendor canopies, 4 ADA compliant luxury restroom trailers'
      },
      {
        id: 'b-c-3',
        category: 'Decor, Florals & Lighting',
        name: '400 Biodegradable Floating Paper Lanterns & Solar Path Stakes',
        estimatedCost: 1200,
        actualCost: 1050,
        paidAmount: 1050,
        status: 'paid',
        priority: 'essential',
        notes: '100% biodegradable rice paper with safe LED tea lights (zero fire hazard)'
      },
      {
        id: 'b-c-4',
        category: 'Entertainment, Music & AV',
        name: 'Local Folk Band ("The Whispering Pines") & Sound Engineer',
        estimatedCost: 2000,
        actualCost: 2000,
        paidAmount: 1000,
        status: 'deposit_paid',
        priority: 'recommended',
        notes: '3 sets of live folk/bluegrass across the afternoon and dusk'
      },
      {
        id: 'b-c-5',
        category: 'Catering & Beverages',
        name: 'Hot Spiced Apple Cider Station & Donut Hole Bar (Free for attendees)',
        estimatedCost: 1800,
        actualCost: 1650,
        paidAmount: 800,
        status: 'deposit_paid',
        priority: 'recommended',
        notes: 'Free hospitality station. Food trucks will sell savory food independently'
      },
      {
        id: 'b-c-6',
        category: 'Invitations, Favors & Signage',
        name: 'Community Yard Signs, Directional Banners & Event Map Flyers',
        estimatedCost: 800,
        actualCost: 750,
        paidAmount: 750,
        status: 'paid',
        priority: 'recommended',
        notes: 'Recyclable corrugated plastic lawn signs placed at key intersections'
      },
      {
        id: 'b-c-7',
        category: 'Contingency & Emergency Reserve',
        name: 'Waste Management, Recycling Bags & Weather Shelter',
        estimatedCost: 2000,
        actualCost: 800,
        paidAmount: 400,
        status: 'planned',
        priority: 'essential',
        notes: 'Green cleanup volunteers gear and extra rain-fly tarps'
      }
    ],
    timelineItems: [
      {
        id: 't-c-1',
        phase: 'planning_early',
        timeLabel: '3 Months Prior',
        title: 'City Council Permit & Parks Approval',
        description: 'Submit park layout, sound variance, traffic control plan to municipal office.',
        category: 'Permits',
        completed: true,
        isKeyMilestone: true
      },
      {
        id: 't-c-2',
        phase: 'planning_mid',
        timeLabel: '6 Weeks Prior',
        title: 'Artisan & Food Truck Vendor Call',
        description: 'Confirm 12 local craft booths, 4 food trucks (tacos, BBQ, crepes, wood-fired pizza).',
        category: 'Vendors',
        completed: true
      },
      {
        id: 't-c-3',
        phase: 'planning_late',
        timeLabel: '10 Days Prior',
        title: 'Volunteer Orientation & Task Assignment',
        description: 'Brief 25 neighborhood volunteers on parking guide, lantern table, cider booth, and safety.',
        category: 'Volunteers',
        completed: false,
        isKeyMilestone: true
      },
      {
        id: 't-c-4',
        phase: 'day_of',
        timeLabel: '11:00 AM',
        title: 'Park Setup & Vendor Booth Arrival',
        description: 'Canopies erected, food trucks park in designated zone, power generator hooked up.',
        category: 'Logistics',
        completed: false
      },
      {
        id: 't-c-5',
        phase: 'day_of',
        timeLabel: '14:00 PM',
        title: 'Festival Officially Opens to Public',
        description: 'Opening remarks by community chair; craft booths open; pumpkin carving station starts.',
        category: 'Festival',
        completed: false,
        isKeyMilestone: true
      },
      {
        id: 't-c-6',
        phase: 'day_of',
        timeLabel: '15:30 PM',
        title: 'Bluegrass & Folk Band Main Stage Set',
        description: 'The Whispering Pines perform acoustic bluegrass at park amphitheater.',
        category: 'Music',
        completed: false
      },
      {
        id: 't-c-7',
        phase: 'day_of',
        timeLabel: '17:45 PM',
        title: 'Pumpkin Carving Contest Judging & Prizes',
        description: 'Ribbons awarded for Funniest, Spookiest, and Most Creative pumpkin creations.',
        category: 'Contest',
        completed: false
      },
      {
        id: 't-c-8',
        phase: 'day_of',
        timeLabel: '18:45 PM',
        title: 'Twilight Lantern Lighting & Lake Walk',
        description: 'Attendees illuminate decorated rice paper lanterns with LED candles and walk the park perimeter trail.',
        category: 'Ceremony',
        completed: false,
        isKeyMilestone: true
      },
      {
        id: 't-c-9',
        phase: 'day_of',
        timeLabel: '20:30 PM',
        title: 'Festival Wrap-Up & "Leave No Trace" Cleanup',
        description: 'Volunteer team sweeps park, compost bins packed, equipment returned to trailer.',
        category: 'Cleanup',
        completed: false
      }
    ],
    vendors: [
      {
        id: 'v-c-1',
        category: 'Security & Permits',
        name: 'Oakridge Parks & Recreation Department',
        contactPerson: 'Director Sarah Jenkins',
        email: 'parks@oakridgegov.org',
        phone: '(970) 555-0144',
        quoteAmount: 1450,
        depositPaid: 1450,
        status: 'booked',
        rating: 5,
        notes: 'Permit #PK-2026-889 approved. Includes access to amphitheater power grid.',
        keyQuestionsToAsk: [
          'Are recycling dumpsters provided on-site or do we need to haul bins?',
          'What is the emergency contact for park ranger on duty?'
        ]
      },
      {
        id: 'v-c-2',
        category: 'Rentals & Furniture',
        name: 'Valley Event Rentals & Sanitation',
        contactPerson: 'Brian Fletcher',
        email: 'sales@valleyeventrentals.com',
        phone: '(970) 555-6677',
        quoteAmount: 3100,
        depositPaid: 1500,
        status: 'booked',
        rating: 4,
        notes: 'Supplying 15 canopies, 40 folding chairs, and 4 restroom units.',
        keyQuestionsToAsk: [
          'What time will delivery drop off Saturday morning?',
          'Do canopies include heavy 40lb sandbags for wind stabilization?'
        ]
      }
    ],
    ideas: [
      {
        id: 'i-c-1',
        category: 'interactive',
        title: 'Community "Wishes for the Year" Lantern Decorating',
        description: 'Provide non-toxic paint pens and calligraphy stamps so families can write community wishes, memories, and poems directly onto their paper lanterns before the evening walk.',
        tags: ['Emotional', 'Family Friendly', 'Artistic'],
        costImpact: 'low',
        difficulty: 'easy',
        bookmarked: true,
        aiSuggestedReason: 'Fosters profound neighborhood connection and gives children an artistic keepsake.'
      },
      {
        id: 'i-c-2',
        category: 'sustainability',
        title: '"Leave No Trace" Zero-Waste Stations & Compost Crew',
        description: 'Partner with local high school environmental club to staff 3 waste stations separating compostable food scraps, recyclable aluminum cans, and trash.',
        tags: ['Eco-friendly', 'Youth Leadership', 'Zero Waste'],
        costImpact: 'low',
        difficulty: 'easy',
        bookmarked: true,
        aiSuggestedReason: 'Saves park cleanup costs and models environmental stewardship for the community.'
      },
      {
        id: 'i-c-3',
        category: 'food_drinks',
        title: 'Neighborhood Apple Cider Press Demonstration',
        description: 'Borrow an antique hand-crank wooden apple cider press; invite attendees to bring apples from their backyard trees to press fresh cider on-site.',
        tags: ['Heritage', 'Interactive', 'Autumn'],
        costImpact: 'low',
        difficulty: 'moderate',
        bookmarked: true,
        aiSuggestedReason: 'One of the most charming hands-on heritage activities that fascinates both kids and grandparents.'
      }
    ],
    guests: [
      { id: 'g-c-1', name: 'Oakridge Community Council (10 pax)', partySize: 10, status: 'attending', groupTag: 'Organizers' },
      { id: 'g-c-2', name: 'Volunteer Team Alpha (8 pax)', partySize: 8, status: 'attending', groupTag: 'Volunteers' },
      { id: 'g-c-3', name: 'High School Green Club (12 pax)', partySize: 12, status: 'attending', groupTag: 'Volunteers' },
      { id: 'g-c-4', name: 'Craft Vendors & Artisans (15 booths)', partySize: 30, status: 'attending', groupTag: 'Vendors' },
      { id: 'g-c-5', name: 'General Public RSVP Waitlist', partySize: 280, status: 'attending', groupTag: 'Community' },
    ],
    createdAt: '2026-01-05T08:00:00.000Z',
    updatedAt: '2026-02-10T16:00:00.000Z'
  }
];
