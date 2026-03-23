# Comprehensive Codebase Analysis - Garde Streaming Platform

**Analysis Date:** March 22, 2026  
**Project:** Garde — Stream Everything (Independent Film Platform)

---

## 1. PROJECT STRUCTURE OVERVIEW

### Architecture
This is a **Next.js 16 (React 19) web application** for a premium streaming platform. The project uses a modern **Client-Side Rendering (CSR)** approach with server components where needed.

### Directory Structure
```
/workspaces/project/
├── src/
│   ├── api/              # API client gateway (currently incomplete)
│   ├── app/              # Next.js App Router pages
│   │   ├── page.tsx      # Home page with featured content
│   │   ├── layout.tsx    # Root layout with providers
│   │   ├── providers.tsx # Query client & auth setup
│   │   ├── login/        # Email OTP authentication
│   │   ├── movies/       # Movies catalog
│   │   ├── series/       # Series catalog
│   │   ├── my-list/      # User's watchlist
│   │   ├── detail/[id]/  # Content detail page
│   │   └── watch/[id]/   # Video player page
│   ├── components/
│   │   ├── auth/         # AuthHandler (Supabase session mgmt)
│   │   ├── cards/        # ContentCard component
│   │   ├── home/         # HeroBanner, ContentRow
│   │   └── layout/       # Navbar
│   ├── lib/
│   │   ├── supabase.ts   # Supabase client initialization
│   │   └── api/content.ts# Content CRUD operations
│   ├── store/            # Zustand state management
│   ├── types/            # TypeScript interfaces
│   └── app/globals.css   # Tailwind CSS custom theme
├── .env.local            # Environment variables (EMPTY - NEEDS CONFIG)
├── .env.example          # Environment template
├── next.config.mjs       # Next.js configuration
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript configuration
└── postcss.config.mjs    # PostCSS + Tailwind setup
```

### Key Files
- **Entry Point:** `src/app/layout.tsx` (Root layout)
- **Landing Page:** `src/app/page.tsx` (Home with featured content)
- **Authentication:** `src/app/login/page.tsx` (Email OTP)
- **Styling:** `src/app/globals.css` (Custom Tailwind theme)

---

## 2. TECHNOLOGY STACK

### Frontend Framework
- **Next.js:** 16.2.1 (React 19.2.4)
- **TypeScript:** ~5.8.2 (Strict mode enabled)
- **Styling:** Tailwind CSS 4.1.14 + PostCSS + Autoprefixer

### State Management & Data
- **Zustand:** 5.0.12 (Client state - user, watchlist)
- **TanStack React Query:** 5.94.5 (Server state, caching, refetching)

### UI & Animation
- **Lucide React:** 0.546.0 (Icons)
- **Motion (Framer Motion):** 12.23.24 (Animations)

### Backend Services
- **Supabase:** 2.99.3 (Authentication, Database)
- **Mux:** 12.8.1 + 3.11.6 (Video streaming/player)

### Additional Libraries
- **Google Generative AI:** 1.46.0 (Gemini API - configured but unused)
- **Express:** 4.21.2 (Not used in current app)
- **dotenv:** 17.2.3 (Environment variable loading)

### Development Tools
- **tsx:** 4.21.0 (TypeScript execution)
- **ESLint:** (Next.js config)

---

## 3. CODE ISSUES & PROBLEMS FOUND

### 🔴 CRITICAL ISSUES

#### 1. **Empty Environment Variables**
**File:** `.env.local`  
**Severity:** CRITICAL  
**Issue:** All environment variables are empty - the app cannot function
```
NEXT_PUBLIC_SUPABASE_URL=         ❌ EMPTY
NEXT_PUBLIC_SUPABASE_ANON_KEY=    ❌ EMPTY
MUX_TOKEN_ID=                      ❌ EMPTY
MUX_TOKEN_SECRET=                  ❌ EMPTY
GEMINI_API_KEY=                    ❌ EMPTY
```
**Impact:** 
- Supabase client will use placeholder values (see `src/lib/supabase.ts` lines 5-8)
- Mux video streaming won't work
- Database operations will fail
- Authentication will fail

**Fix Required:**
```bash
# Set these environment variables:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
MUX_TOKEN_ID=your-token-id
MUX_TOKEN_SECRET=your-token-secret
GEMINI_API_KEY=your-gemini-api-key
```

---

#### 2. **Incomplete API Client Implementation**
**File:** `src/api/client.ts`  
**Severity:** CRITICAL  
**Issue:** The `apiClient.get()` function is a stub that throws an error:
```typescript
throw new Error("API Client requires implementation with real endpoints");
```
**Impact:** 
- Any code using `apiClient` will immediately fail
- No HTTP requests can be made through this gateway

**Fix Required:**
Implement actual API calls or remove this unused file:
```typescript
export const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}${endpoint}`);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json() as Promise<T>;
  }
};
```

---

### 🟡 HIGH PRIORITY ISSUES

#### 3. **Type Mismatch in Content Creation**
**File:** `src/lib/api/content.ts` (line 80-120)  
**Severity:** HIGH  
**Issue:** `seedDatabase()` creates content without the required `created_at` field:
```typescript
const sampleContent = [
  {
    title: "Sintel",
    // ... other fields ...
    // ❌ MISSING: created_at field (required by Content interface)
  },
  // ... more items without created_at
];
```
**Type Definition:** `src/types/index.ts` requires `created_at: string`

**Impact:** 
- Type safety compromise
- Database insert may fail if column is NOT NULL
- Runtime errors possible when retrieving content

**Fix Required:**
```typescript
const sampleContent = [
  {
    title: "Sintel",
    // ... other fields ...
    created_at: new Date().toISOString(),  // ✅ Add this
  },
  // ... for all items
];
```

---

#### 4. **No Persistence for User Authentication State**
**File:** `src/store/useStore.ts` & `src/components/auth/AuthHandler.tsx`  
**Severity:** HIGH  
**Issue:** User state is stored only in Zustand (memory), not localStorage
```typescript
// Current: User data lost on page refresh
export const useStore = create<StoreState>((set, get) => ({
  user: null,  // ❌ Not persisted
  myList: [],  // ❌ Not persisted
  // ...
}));
```

**Impact:**
- User is logged out on page refresh
- Watchlist is lost on page refresh
- Poor UX for streaming app

**Fix Required:**
```typescript
// Add localStorage persistence:
import { persist } from 'zustand/middleware';

export const useStore = create<StoreState>(
  persist(
    (set, get) => ({
      // ... existing state ...
    }),
    {
      name: 'garde-store', // localStorage key
    }
  )
);
```

---

#### 5. **Supabase Credentials with Fallback to Placeholders**
**File:** `src/lib/supabase.ts` (lines 5-8)  
**Severity:** HIGH  
**Issue:** Creates client with placeholder values if environment variables are missing:
```typescript
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',  // ❌ Bad fallback
  supabaseAnonKey || 'placeholder-key'               // ❌ Bad fallback
);
```

**Impact:**
- Silent failure: app loads but all database operations fail
- Confusing error messages in console
- No clear indication that configuration is missing

**Fix Required:**
```typescript
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase credentials. Check .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

### 🟠 MEDIUM PRIORITY ISSUES

#### 6. **Incomplete Watch Page Component**
**File:** `src/app/watch/[id]/page.tsx` (line 90+)  
**Severity:** MEDIUM  
**Issue:** Component code is truncated - missing closing JSX and player controls
```typescript
// File ends abruptly at line ~90 with:
<button 
  // ... controls incomplete
  <SkipForward size={40} fill="currentColor" />
</button>
// ❌ Rest of component missing
```

**Impact:**
- Video player page won't render correctly
- Missing player controls
- TypeScript compilation may fail

**Fix Required:** Complete the video player UI with proper controls

---

#### 7. **No Error Boundaries**
**Severity:** MEDIUM  
**Issue:** No React error boundaries in the app
**Impact:**
- Single component error can crash entire app
- Bad error UX for users

**Fix Required:** Add error boundary component

---

#### 8. **Missing Input Validation**
**File:** `src/app/login/page.tsx`  
**Severity:** MEDIUM  
**Issue:** Email and OTP inputs lack validation:
```typescript
const handleEmailSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // ❌ No email validation before API call
  const { error } = await supabase.auth.signInWithOtp({ email });
};

const handleOtpChange = (index: number, value: string) => {
  // ✅ Has basic OTP validation
  if (!/^\d*$/.test(value)) return;
};
```

**Fix Required:** Add email validation:
```typescript
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const handleEmailSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!isValidEmail(email)) {
    setError('Please enter a valid email');
    return;
  }
  // ... rest of logic
};
```

---

#### 9. **Hardcoded Mux Playback IDs**
**File:** `src/lib/api/content.ts` (seedDatabase function)  
**Severity:** MEDIUM  
**Issue:** Mux playback IDs are hardcoded dummy values:
```typescript
mux_playback_id: "6fiS00pS49Z6Y4q01S4pY5S02N6reD0088",  // ❌ Invalid
mux_playback_id: "v69R01990199020120102010201020102010201",  // ❌ Invalid
```

**Impact:**
- Video player will fail to load
- Users can't watch content

**Fix Required:** Use real Mux playback IDs or implement video upload

---

### 🔵 LOW PRIORITY ISSUES

#### 10. **Extraneous npm Dependencies**
**Severity:** LOW  
**Issue:** Several packages installed but not in package.json:
```
@emnapi/core@1.9.1 (extraneous)
@emnapi/runtime@1.9.1 (extraneous)
@napi-rs/wasm-runtime@0.2.12 (extraneous)
@tybys/wasm-util@0.10.1 (extraneous)
```

**Fix Required:**
```bash
npm prune  # Remove extraneous packages
```

---

#### 11. **Unused Express Dependency**
**Severity:** LOW  
**Issue:** Express is installed but not used anywhere in the app
```json
"express": "^4.21.2"  // ❌ Unused
```

**Fix Required:** Remove from package.json if not needed:
```bash
npm remove express @types/express
```

---

#### 12. **Unused Google Generative AI Package**
**Severity:** LOW  
**Issue:** Gemini API is installed and configured but never imported/used
```json
"@google/genai": "^1.46.0"  // ❌ Not imported anywhere
```

**Impact:**
- Unnecessary dependency bloating bundle
- Feature not implemented

**Fix:** Either implement Gemini integration or remove the package

---

#### 13. **Missing Tailwind Config File**
**Severity:** LOW  
**Issue:** No `tailwind.config.ts` or `tailwind.config.js` file
**Note:** Tailwind theme is defined in `globals.css` with @theme directive (Valid for Tailwind v4)
**Status:** This is actually correct for Tailwind 4, but could be split into separate file for maintainability

---

#### 14. **No Loading/Skeleton States in Some Components**
**Severity:** LOW  
**Issue:** Some pages don't show loading states:
- Detail page (`src/app/detail/[id]/page.tsx`) only shows `min-h-screen bg-background animate-pulse`
- Watch page shows a basic spinner

---

#### 15. **Navbar Code Truncated**
**File:** `src/components/layout/Navbar.tsx` (line 145+)  
**Severity:** LOW  
**Issue:** Component code appears complete but ends abruptly in provided context

---

## 4. ENTRY POINTS & HOW TO RUN

### Application Entry Points

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `src/app/page.tsx` | Home - Featured content & trending |
| `/login` | `src/app/login/page.tsx` | Email OTP authentication |
| `/movies` | `src/app/movies/page.tsx` | Movies catalog |
| `/series` | `src/app/series/page.tsx` | Series catalog |
| `/my-list` | `src/app/my-list/page.tsx` | User's watchlist |
| `/detail/[id]` | `src/app/detail/[id]/page.tsx` | Content details page |
| `/watch/[id]` | `src/app/watch/[id]/page.tsx` | Video player (INCOMPLETE) |

### How to Run Locally

**Prerequisites:**
- Node.js 18+ (npm or yarn)
- Supabase account with project
- Mux account with access token
- Google Gemini API key (optional)

**Step-by-step:**

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with real credentials
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
MUX_TOKEN_ID=your-mux-token-id
MUX_TOKEN_SECRET=your-mux-token-secret
GEMINI_API_KEY=your-gemini-api-key
EOF

# 3. Start development server
npm run dev

# 4. Open http://localhost:3000 in browser
```

### Available npm Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run Next.js linting
```

### Database Setup

The app expects a Supabase `content` table with columns:
```sql
CREATE TABLE content (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  backdrop_url TEXT,
  type TEXT, -- 'movie', 'series', 'live'
  genre TEXT[],
  rating DECIMAL,
  year INTEGER,
  duration TEXT,
  is_premium BOOLEAN,
  is_featured BOOLEAN,
  view_count INTEGER DEFAULT 0,
  mux_asset_id TEXT,
  mux_playback_id TEXT,
  language TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create profiles table for user data
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  subscription_plan TEXT DEFAULT 'free',
  subscription_valid_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 5. MISSING DEPENDENCIES & MISCONFIGURATIONS

### Missing Runtime Dependencies

| Package | Status | Details |
|---------|--------|---------|
| Supabase credentials | ❌ REQUIRED | Not configured in `.env.local` |
| Mux credentials | ❌ REQUIRED | Not configured in `.env.local` |
| Gemini API key | ⚠️ OPTIONAL | Configured but not used |
| Database schema | ❌ REQUIRED | Needs to be created in Supabase |

### Package Quality Issues

| Issue | Details |
|-------|---------|
| Extraneous packages | @emnapi/*, @napi-rs/*, @tybys/* installed but not in package.json |
| Unused dependencies | Express (4.21.2), Google Generative AI (1.46.0) |
| Outdated deps | Motion (12.23.24 in package.json vs 12.38.0 installed) |

### Type Safety Issues

| File | Issue |
|------|-------|
| `src/lib/api/content.ts` | `Content` interface requires `created_at` but `seedDatabase()` doesn't provide it |
| `src/types/index.ts` | No `id` field marked as optional for creation scenarios |
| All async functions | Some lack try-catch error handling |

### Configuration Issues

| Config File | Issue |
|------------|-------|
| `tsconfig.json` | ✅ Correctly configured |
| `next.config.mjs` | ✅ Correct output format (standalone) |
| `postcss.config.mjs` | ✅ Correct Tailwind v4 setup |
| `.env.local` | ❌ All values empty |
| `.env.example` | ✅ Template exists |

---

## 6. DESIGN SYSTEM & STYLING

### Custom Theme (Tailwind v4)
Defined in `src/app/globals.css`:

```css
--color-background: #080810          /* Main background */
--color-accent-indigo: #6366F1       /* Primary accent */
--color-accent-red: #EF4444          /* Secondary accent */
--color-gold: #F5C518                /* Star ratings */
--color-rising: #22C55E              /* Rising badge */
--color-surface: #0D0D18             /* Card backgrounds */
--color-card: #13131F                /* Elevated surfaces */
--color-secondary-text: #8888A8      /* Muted text */
--color-border-custom: #1E1E30       /* Border color */
```

### Custom Utility Classes
- `.glass` - Glassmorphism effect
- `.text-gradient` - Gradient text
- `.noise-overlay` - Film grain effect
- `.animate-gradient-slow` - Slow gradient animation
- `.animate-fade-in` - Fade-in on load

---

## 7. RECOMMENDATIONS SUMMARY

### 🔴 CRITICAL (Fix Before Running)
1. ✅ Configure `.env.local` with real Supabase and Mux credentials
2. ✅ Complete the `/src/app/watch/[id]/page.tsx` component
3. ✅ Fix Supabase client initialization to throw error on missing credentials
4. ✅ Add `created_at` to seedDatabase() content

### 🟡 HIGH (Before Production)
5. ✅ Implement state persistence with Zustand persist middleware
6. ✅ Complete app implementation for `/src/api/client.ts`
7. ✅ Add input validation to login form
8. ✅ Replace hardcoded Mux playback IDs

### 🟠 MEDIUM (Before Deployment)
9. ✅ Complete Navbar component code
10. ✅ Add error boundaries
11. ✅ Improve error handling in async operations
12. ✅ Add better loading states to detail page

### 🔵 LOW (Nice to Have)
13. ✅ Run `npm prune` to remove extraneous packages
14. ✅ Remove unused dependencies (Express, Gemini if not used)
15. ✅ Extract Tailwind theme to separate config file
16. ✅ Add TypeScript strict null checks to some async operations

---

## 8. PERFORMANCE CONSIDERATIONS

- **Bundle Size:** No major issues, using modern bundling
- **Query Caching:** TanStack Query configured with 60s stale time
- **Image Optimization:** Using Next.js Image component not impl yet (external URLs)
- **CSS:** Tailwind with tree-shaking enabled
- **Animation:** Motion library for optimized animations

---

## 9. SECURITY NOTES

⚠️ **Important:**
- `.env.local` contains sensitive keys - never commit to git
- `.gitignore` should exclude `.env.local` (verify)
- Supabase Row Level Security (RLS) policies should be configured
- API routes should validate user permissions
- Video content should be behind authentication

---

## 10. NEXT STEPS

1. **Immediate:** Set up Supabase project and configure credentials
2. **Day 1:** Fix critical issues #1, #3, #4, #5
3. **Day 2:** Complete watch page component and stabilize auth
4. **Day 3:** Test all routes, implement missing features
5. **Day 4:** Performance testing, security review
6. **Day 5:** Deploy to production with proper error monitoring

