// Runtime-only Firebase Auth loader (JS) to avoid pulling firebase *.d.ts into TS.
// Uses real dynamic imports so Vite can bundle Firebase modules correctly.

let cached = null;

// Firebase config from environment variables
const firebaseConfig = {
  // NOTE: Firebase "apiKey" and related config values are NOT secret.
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate that required config is present
function validateFirebaseConfig() {
  const required = ['apiKey', 'authDomain', 'projectId', 'appId'];
  const missing = required.filter(key => !firebaseConfig[key]);
  if (missing.length > 0) {
    console.error('Missing Firebase config:', missing.join(', '));
    console.error('Please ensure VITE_FIREBASE_* environment variables are set.');
    return false;
  }
  return true;
}

export async function getFirebaseAuth() {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  for (const key of requiredVars) {
    if (!import.meta.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  if (cached) return cached;

  if (!validateFirebaseConfig()) {
    throw new Error('Firebase configuration is incomplete. Check environment variables.');
  }

  const appMod = await import("firebase/app");
  const authMod = await import("firebase/auth");

  const app = (appMod.getApps?.().length ?? 0) === 0
    ? appMod.initializeApp(firebaseConfig)
    : appMod.getApp();

  const auth = authMod.getAuth(app);
  const googleProvider = new authMod.GoogleAuthProvider();

  cached = {
    auth,
    googleProvider,
    onAuthStateChanged: authMod.onAuthStateChanged,
    signInWithPopup: authMod.signInWithPopup,
    signInWithRedirect: authMod.signInWithRedirect,
    getRedirectResult: authMod.getRedirectResult,
    signInWithEmailAndPassword: authMod.signInWithEmailAndPassword,
    createUserWithEmailAndPassword: authMod.createUserWithEmailAndPassword,
    sendPasswordResetEmail: authMod.sendPasswordResetEmail,
    signOut: authMod.signOut,
  };

  return cached;
}
