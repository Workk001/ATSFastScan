# ATS FastScan

### AI-powered resume and cover letter analyzer for ATS compatibility

[ATS FastScan](https://atsfastscan.com) is a production-grade, commercial web application designed to help job seekers optimize their resumes and cover letters for Applicant Tracking Systems (ATS). Using Google's state-of-the-art Gemini 2.5 Flash model, the platform extracts, sanitizes, and evaluates document text against targeted roles and job descriptions to provide detailed scoring, keyword checks, and actionable improvements.

---

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

---

## Overview

In today's job market, over 95% of Fortune 500 companies use Applicant Tracking Systems (ATS) to filter resumes before they reach human recruiters. ATS FastScan addresses this bottleneck by simulating recruiter-grade ATS parser algorithms. 

The product successfully launched on Product Hunt in February 2026 and quickly established traction, acquiring **140+ active users within the first two months**. It provides a sleek, responsive frontend experience with robust, secure backend handling.

### Live Demo
👉 **[atsfastscan.com](https://atsfastscan.com)**

---

## Features

- **ATS Compatibility Analysis**: Inspects resume structure, sections, contact information, and machine-readability.
- **Job Description Matching**: Compares candidate resumes with specific job descriptions to calculate alignment scores, highlighting matching and missing keywords.
- **Cover Letter Analysis**: Assesses cover letters for tone, structure, call-to-action impact, and relevance.
- **Scoring & Improvements**: Delivers clear breakdowns (Keyword Match, Experience Quality, Formatting, Readability) alongside optimized rewrite suggestions.
- **Multi-Format Support**: Processes both `.pdf` and `.docx` document uploads.
- **Tiered Subscriptions**: Features structured user access limits (Free, Plus, and Pro tiers) integrated with payment processing.

---

## Tech Stack

- **Frontend**: 
  - **React 18**: Main component-driven user interface.
  - **TypeScript**: Complete compile-time type safety.
  - **Vite**: Ultra-fast build tool and bundler.
  - **Tailwind CSS**: Utility-first, responsive, and custom UI styling.
  - **shadcn/ui**: High-quality, accessible UI components.
  - **Framer Motion**: Premium layout transitions and micro-animations.
- **Backend / Edge Functions**:
  - **Supabase Edge Functions**: Lightweight serverless TypeScript runtimes (Deno-based) for low-latency, region-close API execution.
- **Database**:
  - **Supabase PostgreSQL**: Relational database storage enforcing strict Row-Level Security (RLS).
- **Authentication**:
  - **Firebase Authentication**: Seamless Google OAuth and Email/Password flows, securely verified on the server-side.
- **Payments**:
  - **Razorpay**: Integrated subscription creation, payment verification, and webhook handling (tailored for the Indian market).
- **AI Engine**:
  - **Google Gemini 2.5 Flash**: Lightning-fast, high-context LLM utilized via system instructions for structured JSON analysis.
- **Hosting**:
  - **Vercel** (Frontend) + **Supabase** (Edge Functions).

---

## Architecture Overview

ATS FastScan uses a serverless decoupled architecture. The React frontend interacts with Supabase Edge Functions, keeping client-side operations light and secure. 

```
┌─────────────────┐       HTTPS       ┌────────────────────────┐
│  React Frontend │ ────────────────> │ Supabase Edge Function │
└─────────────────┘                   └────────────────────────┘
         │                                         │
         │ (Auth Token)                            │ (Admin / Service Role)
         ▼                                         ▼
┌─────────────────┐                   ┌────────────────────────┐
│  Firebase Auth  │                   │  PostgreSQL Database   │
└─────────────────┘                   └────────────────────────┘
```

This serverless pattern was selected to:
1. Ensure close proximity to database regions for minimal latency.
2. Minimize operational overhead by avoiding persistent VMs.
3. Automatically scale to handle spikes in traffic during high-load events (such as Product Hunt launches).

---

## Security

The platform has undergone rigorous security hardening to prevent common vulnerabilities and secure user data:

- **JWT Cryptographic Verification**: Every edge function call cryptographically verifies the Firebase ID token using Google's public certificates via RS256 signature verification (`crypto.subtle.verify()`).
- **Atomic Scan Counter**: Entitlements and limit checks are executed atomically at the database level using a custom PostgreSQL RPC function (`increment_scan_count`), making race conditions and scan bypasses impossible.
- **Prompt Injection Defense**: Prepend-only security directives are baked into the system prompts of all AI modules. User-submitted texts are fully sanitized of instruction override keyphrases (e.g. `ignore all previous instructions`) and truncated before prompt compilation.
- **Strict CORS Constraints**: Edge function CORS headers are dynamically verified against an explicit whitelist of production and development domains. Wildcards (`*`) are disallowed.
- **Server-Side File Validation**: Extracted PDF buffers are checked for magic bytes (`%PDF`) and constrained to `10MB` size limits before any processing begins, protecting functions against malware uploads.
- **Webhook Idempotency**: Webhook endpoints store and match `razorpay_event_id` against a unique constraint, preventing double-provisioning or replay attacks.
- **Data Protection**: Zero sensitive credentials, system prompts, or database keys are stored in the browser. RLS policies deny unauthorized database reads/writes.

---

## Subscription Plans

- **Free Tier**: 2 lifetime resume scans.
- **Plus Tier**: 10 resume scans and 5 cover letter scans per month.
- **Pro Tier**: Unlimited scans (enforced as 999,999 in atomic limit RPC checks).

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- Supabase CLI
- Firebase Project
- Razorpay Account

### Clone and Install
```bash
git clone https://github.com/your-username/atsfastscan.git
cd atsfastscan
npm install
```

### Environment Variables Setup

#### 1. Frontend Configuration (`.env.local`)
Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
```

#### 2. Server-Side secrets
Set these variables inside your Supabase project dashboard or via CLI:
```bash
supabase secrets set GEMINI_API_KEY="your-gemini-key"
supabase secrets set RAZORPAY_KEY_ID="your-razorpay-id"
supabase secrets set RAZORPAY_KEY_SECRET="your-razorpay-secret"
supabase secrets set RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"
supabase secrets set RAZORPAY_PLAN_PLUS_MONTHLY="plan_plus_monthly_id"
supabase secrets set RAZORPAY_PLAN_PLUS_ANNUAL="plan_plus_annual_id"
supabase secrets set RAZORPAY_PLAN_PRO_MONTHLY="plan_pro_monthly_id"
supabase secrets set RAZORPAY_PLAN_PRO_ANNUAL="plan_pro_annual_id"
supabase secrets set FIREBASE_PROJECT_ID="your-firebase-project-id"
```

### Running Locally
To launch the Vite development server:
```bash
npm run dev
```
The app will run locally on [http://localhost:8080](http://localhost:8080).

### Deploying Edge Functions
Verify the local project builds cleanly:
```bash
npm run build
```
Deploy the functions to your Supabase project:
```bash
supabase functions deploy analyze-resume
supabase functions deploy analyze-cover-letter
supabase functions deploy subscription
supabase functions deploy razorpay-webhook
```

---

## Database Setup

ATS FastScan uses two core tables: `users` and `subscription_history`. Row-Level Security (RLS) is enabled on all tables, blocking all anonymous or direct authenticated read/writes. Applications access the database securely through RPC and service-role functions.

### Atomic Scan Counter Schema
The database uses a PostgreSQL function to safely evaluate user limits and increment scan counts atomically:
```sql
CREATE OR REPLACE FUNCTION increment_scan_count(
  p_firebase_uid TEXT,
  p_scan_type TEXT,
  p_limit INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
  v_used INTEGER;
  v_col TEXT;
BEGIN
  v_col := CASE WHEN p_scan_type = 'resume' THEN 'resume_scans_used_this_month' ELSE 'cover_letter_scans_used_this_month' END;
  
  EXECUTE format('SELECT %I FROM users WHERE firebase_uid = $1', v_col)
  INTO v_used
  USING p_firebase_uid;
  
  IF v_used >= p_limit THEN
    RETURN FALSE;
  END IF;
  
  EXECUTE format('UPDATE users SET %I = %I + 1, updated_at = NOW() WHERE firebase_uid = $1', v_col, v_col)
  USING p_firebase_uid;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Deployment

- **Frontend**: Deployed on Vercel with clean URLs enabled and client-side route rewrites.
- **Backend / Edge Functions**: Hosted on Supabase Serverless Edge Functions globally.

---

## Project Structure

```
├── src/                      # React Frontend Source Code
│   ├── components/           # UI and Feature Components (shadcn/ui)
│   ├── contexts/             # Global contexts (Auth, Theme)
│   ├── lib/                  # Helper functions and runtimes
│   ├── pages/                # Page Views (Dashboard, Upload, Results)
│   └── main.tsx              # Application Entrypoint
├── supabase/                 # Supabase Backend Configuration
│   ├── functions/            # Serverless Edge Functions
│   │   ├── _shared/          # Shared database, auth, and scan utility logic
│   │   ├── analyze-resume/   # Resume analysis function
│   │   ├── analyze-cover-letter/ # Cover letter analysis function
│   │   ├── subscription/     # Razorpay billing operations
│   │   └── razorpay-webhook/ # Payment sync event listener
│   └── migrations/           # Database schema migrations
└── vercel.json               # Vercel deployment routing configuration
```

---

## License

This project is licensed under the [MIT License](LICENSE).
