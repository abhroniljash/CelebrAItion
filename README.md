# CelebrAItion — GenAI Event & Celebration Planning Assistant

**CelebrAItion** is a complete, user-ready, GenAI-powered planning web application designed to help users effortlessly organize **Weddings**, **Birthdays**, **Community Festivals**, and **Social Gatherings**. It blends generative AI intelligence with practical event coordination tools: budgets, day-of run-of-show timelines, vendor checklists, and personalized creative ideas.

---

## ✨ Key Features

### 🤖 1. GenAI Event Wizard & Blueprint Engine
- **4-Step AI Event Wizard**: Input event type, date, location, guest count, target budget, and aesthetic vibe.
- **Contextual Synthesis**:
  - **Curated 5-Tone Color Harmonies**: Hand-picked color palettes with hex values, styling roles, and 1-click clipboard copy.
  - **Proportional Budget Allocation**: Automatic distribution based on event type industry benchmarks (venue, catering per guest, photography, entertainment, decor, contingency reserve).
  - **Milestone Roadmap & Hourly Day-Of Run-of-Show**: Comprehensive countdown from months prior all the way to minute-by-minute execution.
  - **Categorized Vendor Checklists**: Pre-configured with essential vetting interview questions for every category.
  - **Personalized Creative Ideas**: Bespoke food & beverage concepts, interactive guest experiences, signature cocktails, and eco-friendly favors.
- **Hybrid AI Architecture**:
  - Works **100% out-of-the-box with zero configuration** using our built-in intelligent Generative Engine.
  - Supports entering a **Google Gemini API Key** (in Settings) to connect directly to Gemini 1.5/2.0 Flash models!

### 💰 2. Financial Budget & Expense Tracker
- **Real-Time Financial Dashboard**: Total Budget Goal, Committed/Estimated, Actual Paid to Date, and Remaining Safety Buffer.
- **Visual Category Breakdown**: Progress bars showing proportional spend across Venue, Catering, Photo, Decor, Entertainment, Attire, and Contingency.
- **Expense Item Management**: Add, edit, or delete items; track payment status (`planned`, `deposit_paid`, `paid`), priority ratings (`essential`, `recommended`, `optional`), and notes.
- **Quick Mark as Paid**: 1-click action to log payments and deposits.
- **CSV Export**: Export full budget sheets directly to CSV for spreadsheets.

### ⏱️ 3. Interactive Timeline & Day-Of Run-of-Show
- **Dual View Modes**: Switch between **Planning Roadmap** (6-12 months, 2-6 months, week-of) and **Day-Of Schedule** (hourly minute-by-minute itinerary).
- **Celebratory Interactive Checkboxes**: Mark tasks complete with celebration confetti.
- **Key Milestone Badging**: Highlight critical dates (venue deposit, catering sign-off, ceremony start).
- **Add Custom Slots**: Add custom timing slots with phase assignment and category tags.

### 🤝 4. Vendor Management & AI Outreach Generator
- **Categorized Vendor Directory**: Venues, Caterers, Photographers, Florists, DJs/Bands, Rentals, and Permits.
- **Status Pipeline**: Track status from `researching` → `contacted` → `shortlisted` → `booked`.
- **AI Vetting Questions**: Collapsible checklist of category-specific questions to ask before signing contracts.
- **1-Click AI Outreach RFP Generator**: Generates a tailored, professional inquiry email with event details and questions ready to copy or open in your email client.

### 💡 5. AI Idea & Concept Studio
- **Curated Creative Touches**: Filter ideas across Theme, Decor, Food & Drinks, Entertainment, Favors, Interactive, and Sustainability.
- **AI Reasoning**: Explains why each idea complements the specific event theme and vibe.
- **Interactive Expansion**: Click **"Generate More Ideas with AI"** to dynamically brainstorm new concepts.
- **One-Click Actions**: Bookmark favorites or add ideas directly into your Budget with estimated costs!

### 👥 6. Guest List & RSVP Manager
- **RSVP Tracking**: Confirmed Attending (party sizes calculated), Pending Invitations, and Declined counts.
- **Catering Dietary Alerts Box**: Automatically aggregates dietary restrictions (Vegan, Gluten-Free, Celiac, Nut Allergies) for the catering team.
- **Group & Table Seating**: Assign groups (Family, VIP, Friends) and table numbers.
- **CSV Export**: Download formatted guest list for printing or calligraphy.

### 💬 7. PlanBot — Floating AI Event Assistant
- Chat drawer accessible anytime from anywhere in the app.
- Context-aware suggestions:
  - *“How can I cut 15% from catering without hurting guest experience?”*
  - *“Draft a photographer inquiry email with questions.”*
  - *“Plan B rain contingency protocol for outdoor lawn.”*
  - *“Write a 2-minute heartwarming toast speech template.”*
- Actionable buttons embedded in AI responses (e.g. *+ Add Expense to Budget*, *+ Add Slot to Timeline*, *Copy to Clipboard*).

### 📄 8. Master Plan Export & Printing
- Clean, formatted printable layout with print styling.
- **Print to PDF** directly from the browser.
- **Download JSON Backup** for full data backup and restoration.

### 🌓 9. Modern Aesthetic & Dark Mode
- Built with Tailwind CSS, custom glassmorphism panels, Lucide icons, and smooth transitions.
- Fully supports light and dark themes with persistent user preference.
- 3 realistic pre-loaded starter events:
  1. *Aria & Julian's Coastal Olive Grove Wedding*
  2. *Leo's Retro Synthwave 30th Birthday Bash*
  3. *Oakridge Annual Harvest & Lantern Festival*

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm or pnpm

### Running the App Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## 🛠️ Tech Stack
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom Glassmorphism utilities & Dark Mode
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **AI Integration**: Google Gemini API REST client + Built-in Contextual Generative Simulation Model
- **Storage**: Browser LocalStorage persistence with Seed Fallbacks
