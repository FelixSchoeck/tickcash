'use client';

import { useEffect, useState } from "react";

export function useConsent() {
  const [consent, setConsent] = useState<"granted" | null>(null);
  const [hasDecided, setHasDecided] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cookie-consent");
    if (saved === "granted") {
      setConsent("granted");
      setHasDecided(true);
    }
  }, []);

  const grant = () => {
    localStorage.setItem("cookie-consent", "granted");
    setConsent("granted");
    setHasDecided(true);
  };

  const deny = () => {
    setConsent(null); // kein Storage
    setHasDecided(true); // Dialog schließen
  };

  return { consent, hasDecided, grant, deny };
}
