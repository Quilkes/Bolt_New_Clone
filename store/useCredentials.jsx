import { create } from "zustand";
import { persist } from "zustand/middleware";
import { auth } from "@/app/firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const useCredentials = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "auth-credentials",
    }
  )
);

// Sync Zustand store with Firebase auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    useCredentials.getState().setUser({
      email: user.email,
      name: user.displayName || "User",
      uid: user.uid,
    });
  } else {
    useCredentials.getState().clearUser();
  }
});

// Function to handle sign-out
export const handleSignOut = async (router) => {
  try {
    await signOut(auth);
    useCredentials.getState().clearUser();
    router.push("/login");
  } catch (error) {
    console.error("Sign out failed:", error);
  }
};

export default useCredentials;
