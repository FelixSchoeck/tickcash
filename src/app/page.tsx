"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { CookieConsentDialog } from "@/components/cookie-consent-dialog";
import { useConsent } from "@/lib/useConsent";
import { useConsentStore } from "@/lib/consent-store";

interface Session {
  start: string;
  end: string;
  earned: number;
}

export default function Home() {
  const [wage, setWage] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [earned, setEarned] = useState<number>(0);
  const [showDialog, setShowDialog] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showSessions, setShowSessions] = useState(false);
  const consent = useConsentStore((state) => state.consent);
  const hasDecided = useConsentStore((state) => state.hasDecided);
  const loadConsent = useConsentStore((state) => state.load);

  const goals = [
    { label: "☕ Kaffee", amount: 3.5 },
    { label: "🥐 Frühstück", amount: 7 },
    { label: "🍿 Kinoticket", amount: 12 },
    { label: "👕 T-Shirt", amount: 25 },
    { label: "🏨 Hotelnacht", amount: 70 },
  ];

  useEffect(() => {
    loadConsent(); // Zustand initial laden
  }, []);

  useEffect(() => {
    if (!hasDecided) return;

    if (consent === "granted") {
      const savedWage = localStorage.getItem("wage");
      if (savedWage) {
        setWage(parseFloat(savedWage));
      } else {
        setShowDialog(true);
      }

      const savedSessions = localStorage.getItem("sessions");
      if (savedSessions) {
        setSessions(JSON.parse(savedSessions));
      }
    } else {
      // consent === null → abgelehnt oder noch nie erteilt
      setShowDialog(true);
    }
  }, [consent, hasDecided]);

  // Live-Berechnung
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diffInSeconds = (now.getTime() - startTime.getTime()) / 1000;
        const earnedSoFar = (diffInSeconds / 3600) * wage;
        setEarned(earnedSoFar);
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime, wage]);

  useEffect(() => {
    if (consent && wage === 0 && !showDialog) {
      const savedWage = localStorage.getItem("wage");
      if (!savedWage) {
        setShowDialog(true);
      }
    }
  }, [consent]);

  useEffect(() => {
    console.log("Consent status:", consent);
    console.log("Has decided:", hasDecided);
  }, [consent, hasDecided]);

  const startTracking = () => {
    setStartTime(new Date());
    setIsRunning(true);
  };

  const stopTracking = () => {
    if (!startTime) return;

    const newSession: Session = {
      start: startTime.toISOString(),
      end: new Date().toISOString(),
      earned: earned,
    };
    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);

    if (consent === "granted") {
      localStorage.setItem("sessions", JSON.stringify(updatedSessions));
    }

    setIsRunning(false);
    setEarned(0);
  };

  const handleSaveWage = () => {
    if (wage > 0 && consent === "granted") {
      localStorage.setItem("wage", wage.toString());
    }
    setShowDialog(false);
  };

  const handleChangeWage = () => {
    setShowDialog(true);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4 p-4 bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors">
      {/* Cookie Consent Dialog */}
      <CookieConsentDialog />

      {/* Stundenlohn Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stundenlohn eingeben</DialogTitle>
            <DialogDescription>
              Wie viel verdienst du pro Stunde? (z. B. 17.50 €)
            </DialogDescription>
          </DialogHeader>
          <input
            type="number"
            placeholder="€ / Stunde"
            value={wage}
            onChange={(e) => setWage(Number(e.target.value))}
            className="w-full mt-4 p-2 border rounded"
          />
          <Button
            className="mt-4 w-full"
            onClick={handleSaveWage}
            disabled={wage <= 0}
          >
            Speichern
          </Button>
        </DialogContent>
      </Dialog>

      {/* Main App */}
      {!showDialog && (
        <>
          <ThemeToggle />
          <h1 className="text-4xl font-bold text-center">💸 Live-Verdienst</h1>
          <p className="text-sm text-muted-foreground">
            Stundenlohn: {wage.toFixed(2).replace(".", ",")} €
          </p>

          <p className="text-6xl font-mono">
            {earned.toFixed(3).replace(".", ",")} €
          </p>

          <div className="flex gap-4 mt-6 flex-wrap justify-center">
            <Button onClick={startTracking} disabled={isRunning}>
              Start
            </Button>
            <Button
              onClick={stopTracking}
              variant="destructive"
              disabled={!isRunning}
            >
              Stop
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSessions(!showSessions)}
            >
              Sessions ansehen
            </Button>
            <Button
              variant="outline"
              onClick={() => console.log("has decided: " + hasDecided)}
            >
              debug
            </Button>
            <Button variant="ghost" onClick={handleChangeWage}>
              Lohn ändern
            </Button>
          </div>

          {/* Session Historie */}
          {showSessions && (
            <div className="mt-8 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-2">Session Historie</h2>
              <ul className="space-y-2 max-h-60 overflow-y-auto border p-2 rounded">
                {sessions.map((s, i) => (
                  <li key={i} className="text-sm border-b pb-1">
                    <div>Start: {new Date(s.start).toLocaleString()}</div>
                    <div>Ende: {new Date(s.end).toLocaleString()}</div>
                    <div>
                      Verdient: {s.earned.toFixed(2).replace(".", ",")} €
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Ziele */}
          <div className="mt-8 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Du hast dir verdient:
            </h2>
            <ul className="space-y-2">
              {goals.map((goal, index) => {
                const isReached = earned >= goal.amount;
                return (
                  <li
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded border transition-colors ${
                      isReached
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-200 dark:border-zinc-700"
                    }`}
                  >
                    <span className="text-lg">{goal.label}</span>
                    <span className="ml-auto text-sm text-muted-foreground">
                      {goal.amount.toFixed(2).replace(".", ",")} €
                    </span>
                    {isReached && (
                      <span className="text-green-600 font-bold">✓</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </main>
  );
}
