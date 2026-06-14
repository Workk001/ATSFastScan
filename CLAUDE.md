# ATS FastScan — Project Context & Architecture

This document provides a comprehensive overview of the **ATS FastScan** codebase, its architectural patterns, integrations, database schemas, and critical engineering constraints.

---

## 1. Overview & Setup

ATS FastScan is a production SaaS that analyzes resumes and cover letters against Job Descriptions (JDs) for ATS compatibility and readability.

### Technology Stack
*   **Frontend**: React 18 (SPA with React Router), TypeScript, Tailwind CSS, shadcn/ui components, and `framer-motion` for transitions.
*   **Backend**: Supabase Edge Functions written in TypeScript (run on Deno).
*   **Database**: Supabase PostgreSQL.
*   **Authentication**: Firebase Auth.
*   **Payments**: Razorpay (India) subscriptions.
*   **AI Engine**: Gemini 2.5 Flash (accessed via the Lovable AI Gateway).

### Local Commands
*   **Install dependencies**: `npm install`
*   **Run local dev server**: `npm run dev` (runs on `http://localhost:8080` by default)
*   **Build production bundle**: `npm run build`
*   **Lint project**: `npm run lint`

### Environment Variables
For local development, create a `.env.local` file at the root. The project requires the following:
```env
# Frontend configurations
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Backend (Deno Edge Functions environment config - configure in Supabase dashboard or locally via CLI)
GEMINI_API_KEY=your_google_ai_studio_gemini_api_key
EXTERNAL_SUPABASE_URL=https://your-external-supabase-url.supabase.co
EXTERNAL_SUPABASE_SERVICE_KEY=your_external_supabase_service_role_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

---

## 2. Authentication Strategy

To maintain an optimized initial bundle size, Firebase Auth is loaded lazily at runtime instead of being compiled into the main application chunk.

### Dynamic Loading
*   [firebaseAuthRuntime.js](file:///c:/Users/chanw/Desktop/atsfastscan-main/src/lib/firebaseAuthRuntime.js) contains `getFirebaseAuth()` which dynamically imports `firebase/app` and `firebase/auth`.
*   [AuthContext.tsx](file:///c:/Users/chanw/Desktop/atsfastscan-main/src/contexts/AuthContext.tsx) consumes this helper. The auth listener/IndexedDB check only initializes when a returning user session is detected or when the user initiates an authentication action (e.g., Google login, email login).
*   **Session Persistence**: Firebase stores user state in IndexedDB named `firebaseLocalStorage`. On mount, [AuthContext.tsx](file:///c:/Users/chanw/Desktop/atsfastscan-main/src/contexts/AuthContext.tsx) executes a lightweight check for this DB name. If found, it triggers Firebase Auth initialization to restore the session. Otherwise, initialization is deferred until user interaction.

---

## 3. Database Topology

The application communicates with a single Supabase project for all client-side and server-side data:

*   **Role**: Holds all core user data, plan entitlements, payment records, and scan history.
*   **Access**: Interacted with on the client side via the Supabase client located at [client.ts](file:///c:/Users/chanw/Desktop/atsfastscan-main/src/integrations/supabase/client.ts), and securely server-side inside Edge Functions using the service role key.
*   **Schema**:
    *   **`users` table**: Primary key is a UUID (`id`), but records are queried using `firebase_uid` (indexed string from Firebase Auth).
    *   **`subscription_history` table**: Records subscription transaction statuses (`success`, `failed`, `refunded`) linked via `user_id` (foreign key pointing to `users.id` UUID).

---

## 4. Subscription & Billing Model

Subscriptions are structured for the Indian market using **Razorpay**.

### Entitlements
*   **Free Plan**: 2 lifetime resume scans. Cover letter scans are disabled (limit: 0).
*   **Plus Plan**: 10 resume scans and 5 cover letter scans per month.
*   **Pro Plan**: Unlimited resume scans and cover letter scans.

### Webhook & Lifecycle (in `razorpay-webhook` edge function)
*   `subscription.activated`: Emitted upon subscription initialization. Updates `razorpay_subscription_id` in the database, but does **not** grant paid access yet.
*   `subscription.charged`: Emitted on successful charge. Grants access by setting `plan_type` to `plus`/`pro`, `subscription_status` to `'active'`, and calculates subscription end dates.
    *   *Upgrade Scans Logic*: If upgrading from a free plan, any remaining unused free scans are converted into a "negative used count" credit (acting as bonus scans). If all free scans were used, the counter resets to `0`.
*   `subscription.cancelled`: Emitted when automatic renewals are cancelled. Access remains active (i.e., `plan_type` and `subscription_status` are unchanged) until `subscription_end_date` passes.
*   `subscription.completed`: Emitted when the paid billing period ends. The user is downgraded back to `free`.
*   `payment.failed`: Logs payment failures to the database `subscription_history` without immediately downgrading (Razorpay retries).

---

## 5. Backend Edge Functions (Deno)

All edge functions reside in `supabase/functions/` and communicate with the external Supabase instance using shared Deno modules.

### Shared Modules
*   [external-supabase.ts](file:///c:/Users/chanw/Desktop/atsfastscan-main/supabase/functions/_shared/external-supabase.ts): Implements SQL actions (`getOrCreateUser`, `updateUser`, `logSubscriptionPayment`) using the service role client.
*   [scan-limits.ts](file:///c:/Users/chanw/Desktop/atsfastscan-main/supabase/functions/_shared/scan-limits.ts): Enforces user plan validations, checks monthly quota renewals, resets monthly cycles, and increments usage counters.
*   [firebase-auth.ts](file:///c:/Users/chanw/Desktop/atsfastscan-main/supabase/functions/_shared/firebase-auth.ts): Decodes and validates the Firebase Auth ID tokens passed from the frontend client header.

### Endpoints
*   `analyze-resume`: Extracts PDF contents server-side using `pdfjs-serverless`. (Note: DOCX parsing occurs on the frontend using JSZip/mammoth.js and is sent directly as pre-extracted text). Generates system prompts, maps role keywords, executes the AI analysis model (`google/gemini-2.5-flash`), sanitizes the output, increments scan counts, and returns a structured JSON payload conforming to [analysis.ts](file:///c:/Users/chanw/Desktop/atsfastscan-main/src/types/analysis.ts).
*   `analyze-cover-letter`: Replicates the resume analysis pattern using cover-letter-specific system prompts.
*   `subscription`: Handles frontend Razorpay subscription creations and verifies client-side payments.

---

## 6. Engineering & Design Constraints

### Security & Privacy
*   **Data Isolation**: **Never** store raw resume text or generated analysis output in browser `localStorage` or local persistent stores.
*   **State Purging**: Store analysis payloads in React Router location state or React memory context. When the user logs out, purge all router state and clear `sessionStorage`.

### Layout & UI
*   **Theme**: Dark, premium SaaS style using the **Satoshi** font.
*   **Modals / Dialogs**: Always use the centering utility `inset-0 m-auto h-fit` to ensure consistent presentation across varying viewports.

### Bundling Optimization
*   manualChunks configuration in `vite.config.ts` segments Firebase, React runtime, React Router, and UI dependencies (`framer-motion` + Radix) into distinct cached assets to maximize loading efficiency.
