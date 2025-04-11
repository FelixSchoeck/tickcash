// components/cookie-consent-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useConsentStore } from "@/lib/consent-store";

export function CookieConsentDialog() {
  const hasDecided = useConsentStore((s) => s.hasDecided);
  const grant = useConsentStore((s) => s.grant);
  const deny = useConsentStore((s) => s.deny);

  return (
    <Dialog open={!hasDecided}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cookie-Erlaubnis</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Möchtest du erlauben, dass wir deinen Stundenlohn & Sessions lokal
          speichern?
        </p>
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={deny}>
            Nein
          </Button>
          <Button onClick={grant}>Ja</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
