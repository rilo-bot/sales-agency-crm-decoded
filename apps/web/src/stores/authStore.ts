import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

interface AuthState {
  currentUser: AuthUser | null;
  users: StoredUser[];
}

interface AuthActions {
  register: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],

      register: (name, email, password) => {
        const { users } = get();
        const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          return { ok: false, error: 'This email is already registered.' };
        }
        const newUser: StoredUser = {
          id: crypto.randomUUID(),
          name,
          email,
          passwordHash: password,
          createdAt: new Date().toISOString(),
        };
        const currentUser: AuthUser = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          createdAt: new Date(newUser.createdAt),
        };
        set((state) => ({ users: [...state.users, newUser], currentUser }));
        return { ok: true };
      },

      login: (email, password) => {
        const { users } = get();
        const found = users.find(
          (u) =>
            u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password,
        );
        if (!found) {
          return { ok: false, error: 'Invalid credentials. Please try again.' };
        }
        const currentUser: AuthUser = {
          id: found.id,
          name: found.name,
          email: found.email,
          createdAt: new Date(found.createdAt),
        };
        set({ currentUser });
        return { ok: true };
      },

      logout: () => {
        set({ currentUser: null });
      },
    }),
    { name: 'agencyflow-auth' },
  ),
);
