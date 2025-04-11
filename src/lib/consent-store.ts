'use client';

import { create } from 'zustand';

type ConsentState = {
  consent: "granted" | null;
  hasDecided: boolean;
  grant: () => void;
  deny: () => void;
  load: () => void;
};

export const useConsentStore = create<ConsentState>((set) => ({
  consent: null,
  hasDecided: false,
  grant: () => {
    localStorage.setItem("cookie-consent", "granted");
    set({ consent: "granted", hasDecided: true });
  },
  deny: () => {
    set({ consent: null, hasDecided: true });
  },
  load: () => {
    const saved = localStorage.getItem("cookie-consent");
    if (saved === "granted") {
      set({ consent: "granted", hasDecided: true });
    }
  },
}));
