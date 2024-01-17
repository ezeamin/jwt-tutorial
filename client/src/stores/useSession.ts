import { create } from 'zustand';

import { decodePayload } from '@/utilities';

import type { User } from '@/interface';

const baseUrl = import.meta.env.VITE_BACK_URL;

interface SessionStore {
  user: User | null;
  isLoggedIn: boolean;
  accessToken: string | null;
  logout: () => void;
  login: ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => void;
  refreshToken: () => void;
}

export const useSession = create<SessionStore>((set) => ({
  user: null,
  isLoggedIn: false,
  accessToken: null,
  logout: async () => {
    try {
      const res = await fetch(`${baseUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error();

      set({ user: null, isLoggedIn: false, accessToken: null });
    } catch (e) {
      console.error(e);
      // eslint-disable-next-line no-alert -- toast API is not available
      alert('There was an error while logging out. Please try again.');
    }
  },
  login: async ({ username, password }) => {
    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (!res.ok) throw new Error();

      const {
        data: { token: accessToken },
      } = await res.json();

      if (!accessToken) throw new Error();

      const tokenData = decodePayload(accessToken);

      set({ accessToken, isLoggedIn: true, user: tokenData.user });
    } catch (e) {
      console.error(e);
      // eslint-disable-next-line no-alert -- toast API is not available
      alert('There was an error while logging in. Please try again.');
    }
  },
  refreshToken: async () => {
    // We don't handle error logging here because its common that this returns a 401
    const res = await fetch(`${baseUrl}/auth/refresh-token`, {
      method: 'GET',
      credentials: 'include',
    });

    if (res.status === 401) return;

    const {
      data: { token: accessToken },
    } = await res.json();

    if (!accessToken) return;

    const tokenData = decodePayload(accessToken);

    set({ accessToken, isLoggedIn: true, user: tokenData.user });
  },
}));
