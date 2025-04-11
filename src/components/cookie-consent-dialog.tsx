"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useConsent } from "@/lib/useConsent";

export function CookieConsentDialog() {
  const { hasDecided, grant, deny } = useConsent();

  return (
    <Dialog open={!hasDecided}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cookie-Erlaubnis</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Diese App kann deinen Stundenlohn und Sessions im lokalen Speicher
          sichern, um deine Fortschritte zu merken. Möchtest du das erlauben?
        </p>
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={deny}>
            Nein, jedes Mal fragen
          </Button>
          <Button onClick={grant}>Ja, speichern</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
