import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from "react";
import { getFirebaseAuth } from "@/lib/firebaseAuthRuntime";
import { toAuthUser, type AuthUser } from "@/lib/firebaseAuthTypes";
import posthog from "posthog-js";

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const fallbackAuthContext: AuthContextType = {
  user: null,
  loading: false,
  signInWithGoogle: async () => {
    throw new Error("AuthProvider is missing");
  },
  signInWithEmail: async () => {
    throw new Error("AuthProvider is missing");
  },
  signUpWithEmail: async () => {
    throw new Error("AuthProvider is missing");
  },
  sendPasswordReset: async () => {
    throw new Error("AuthProvider is missing");
  },
  logout: async () => {
    throw new Error("AuthProvider is missing");
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  return context ?? fallbackAuthContext;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false); // Start false — no Firebase loaded yet
  const firebaseInitialized = useRef(false);
  const unsubscribeRef = useRef<(() => void) | undefined>();

  // Initialize Firebase auth listener — called lazily on first auth action
  const ensureFirebaseInit = useCallback(async () => {
    if (firebaseInitialized.current) return;
    firebaseInitialized.current = true;
    setLoading(true);

    try {
      const fb = await getFirebaseAuth();

      // Handle pending redirect (Google sign-in redirect flow)
      fb.getRedirectResult?.(fb.auth).catch(() => {});

      unsubscribeRef.current = fb.onAuthStateChanged(fb.auth, (rawUser) => {
        const authUser = rawUser ? toAuthUser(rawUser) : null;
        setUser(authUser);
        setLoading(false);

        if (import.meta.env.VITE_POSTHOG_KEY) {
          if (authUser) {
            posthog.identify(authUser.uid, {
              email: authUser.email,
            });
          } else {
            posthog.reset();
          }
        }
      });
    } catch {
      setUser(null);
      setLoading(false);
    }
  }, []);

  // Check if there's a cached Firebase auth state (persisted by Firebase SDK in IndexedDB)
  // Only init on mount if we detect a returning user via a lightweight check
  useEffect(() => {
    // Firebase persists auth in IndexedDB under "firebaseLocalStorageDb"
    // If the DB exists, a user may be logged in — init Firebase to restore session
    const checkReturningUser = async () => {
      try {
        const dbs = await indexedDB.databases();
        const hasFirebaseDb = dbs.some(db => db.name?.includes("firebaseLocalStorage"));
        if (hasFirebaseDb) {
          await ensureFirebaseInit();
        }
      } catch {
        // indexedDB.databases() not supported in some browsers — init Firebase as fallback
        await ensureFirebaseInit();
      }
    };
    checkReturningUser();

    return () => {
      unsubscribeRef.current?.();
    };
  }, [ensureFirebaseInit]);

  const signInWithGoogle = useCallback(async () => {
    await ensureFirebaseInit();
    const fb = await getFirebaseAuth();

    try {
      await fb.signInWithPopup(fb.auth, fb.googleProvider);
    } catch (err) {
      const firebaseError = err as { code?: string };
      if (firebaseError?.code === "auth/popup-blocked" || firebaseError?.code === "auth/popup-closed-by-user") {
        await fb.signInWithRedirect(fb.auth, fb.googleProvider);
        return;
      }
      throw err;
    }
  }, [ensureFirebaseInit]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    await ensureFirebaseInit();
    const fb = await getFirebaseAuth();
    await fb.signInWithEmailAndPassword(fb.auth, email, password);
  }, [ensureFirebaseInit]);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    await ensureFirebaseInit();
    const fb = await getFirebaseAuth();
    await fb.createUserWithEmailAndPassword(fb.auth, email, password);
  }, [ensureFirebaseInit]);

  const sendPasswordReset = useCallback(async (email: string) => {
    await ensureFirebaseInit();
    const fb = await getFirebaseAuth();
    await fb.sendPasswordResetEmail(fb.auth, email);
  }, [ensureFirebaseInit]);

  const logout = useCallback(async () => {
    const fb = await getFirebaseAuth();
    await fb.signOut(fb.auth);
    localStorage.removeItem("resumeAnalysisHistory");
    sessionStorage.clear();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
