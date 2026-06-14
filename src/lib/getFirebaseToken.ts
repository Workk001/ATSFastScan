// Helper to get Firebase ID token for authenticated API calls
import { getFirebaseAuth } from "./firebaseAuthRuntime";

export async function getFirebaseIdToken(): Promise<string | null> {
  try {
    const fb = await getFirebaseAuth();
    const currentUser = fb.auth.currentUser;
    
    if (!currentUser) {
      console.warn("[Auth] No current user, cannot get token");
      return null;
    }
    
    // Get fresh ID token
    const token = await currentUser.getIdToken(/* forceRefresh */ false);
    return token;
  } catch (error) {
    console.error("[Auth] Failed to get ID token:", error);
    return null;
  }
}
