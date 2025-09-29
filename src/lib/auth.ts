import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
interface AuthState {
  isAuthenticated: boolean;
  tenant: {
    subdomain: string;
    name: string;
  } | null;
  login: (tenant: { subdomain: string; name: string }) => void;
  logout: () => void;
}
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      tenant: null,
      login: (tenant) => set({ isAuthenticated: true, tenant }),
      logout: () => set({ isAuthenticated: false, tenant: null }),
    }),
    {
      name: 'zenith-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
export const getSubdomain = () => {
  const host = window.location.hostname;
  const parts = host.split('.');
  if (parts.length > 2 && parts[0] !== 'www') {
    return parts[0];
  }
  return null;
};