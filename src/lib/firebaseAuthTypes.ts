export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

export const toAuthUser = (user: {
  uid?: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
} | null | undefined): AuthUser => ({
  uid: String(user?.uid ?? ""),
  email: (user?.email ?? null) as string | null,
  displayName: (user?.displayName ?? null) as string | null,
  photoURL: (user?.photoURL ?? null) as string | null,
});
