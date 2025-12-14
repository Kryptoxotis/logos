# Krypto Greek

**Unlock the original text** - A Progressive Web App for learning Koine Greek

## Features

### Alphabet Module
- All 24 Greek letters with uppercase and lowercase forms
- Erasmian pronunciation guides
- Multiple quiz types:
  - Greek letter → English name
  - English name → Greek letter
  - Lowercase ↔ Uppercase matching

### Parsing Module
- **Noun Parsing** (unlocks at 80% alphabet mastery)
  - First and Second Declension endings
  - Case, Gender, Number identification
- **Verb Parsing** (unlocks at 70% noun mastery)
  - Present, Imperfect, Future, Aorist, Perfect tenses
  - Active, Middle, Passive voices
  - All moods including participles

### Spaced Repetition
- SM-2 algorithm for optimal learning
- Adaptive difficulty based on performance
- Progress tracking across sessions

### PWA Features
- Installable on mobile home screen
- Works offline
- Dark mode (default) and light mode
- Mobile-first design

## Tech Stack

- React 18 + TypeScript
- Vite for build tooling
- IndexedDB for persistent storage
- Framer Motion for animations
- PWA with Workbox

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   ├── alphabet/    # Alphabet-specific components
│   └── parsing/     # Parsing-specific components
├── data/            # Greek language data
│   ├── alphabet.ts  # 24 Greek letters
│   ├── nounEndings.ts
│   └── verbEndings.ts
├── hooks/           # Custom React hooks
├── lib/             # Utilities
│   ├── storage.ts   # IndexedDB operations
│   ├── srs.ts       # Spaced repetition engine
│   └── quiz.ts      # Quiz generation
├── pages/           # Page components
├── styles/          # Global CSS
└── types/           # TypeScript types
```

## Deployment

Deploy to Vercel, Netlify, or any static hosting:

```bash
npm run build
# Deploy the `dist` folder
```

## Future Plans

- Vocabulary module
- Cloud sync with user accounts
- Modern Greek pronunciation toggle
- Leaderboards and streaks

## License

MIT
