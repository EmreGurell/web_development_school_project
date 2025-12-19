import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set, get) => ({
      authToken: null,
      
      setToken: (token) => {
        set({ authToken: token });
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
        }
      },
      
      clearToken: () => {
        set({ authToken: null });
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          document.cookie = "token=; path=/; max-age=0";
        }
      },
      
      getToken: () => {
        const state = get();
        if (state.authToken) {
          return state.authToken;
        }
        // Fallback to localStorage if not in state
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token");
          if (token) {
            set({ authToken: token });
            return token;
          }
        }
        return null;
      },
    }),
    {
      name: "auth-storage",
      // Only persist token, not the whole state
      partialize: (state) => ({ authToken: state.authToken }),
    }
  )
);

export { useStore };

