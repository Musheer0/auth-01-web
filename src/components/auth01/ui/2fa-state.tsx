"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { auth01Client } from "@/client/auth01-client";

export const TwoFASettings = () => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Enable 2FA
  const enableMutation = useMutation({
    mutationFn: () => auth01Client.Enable2fa(),
    onSuccess: (data) => {
      if ("error" in data) setStatusMessage(`Error: ${data.error}`);
      else setStatusMessage("✅ 2FA Enabled successfully!");
    },
    onError: (err) => {
      setStatusMessage(`Something went wrong: ${err?.message || err}`);
    },
  });

  // Disable 2FA (no password)
  const disableMutation = useMutation({
    mutationFn: () => auth01Client.Disable2fa(),
    onSuccess: (data) => {
      if ("error" in data) setStatusMessage(`Error: ${data.error}`);
      else setStatusMessage("❌ 2FA Disabled successfully!");
    },
    onError: (err) => {
      setStatusMessage(`Something went wrong: ${err?.message || err}`);
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>

      {/* Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={() => enableMutation.mutate()}
          disabled={enableMutation.isPending}
        >
          {enableMutation.isPending ? "Enabling..." : "Enable 2FA"}
        </Button>

        <Button
          variant="destructive"
          onClick={() => disableMutation.mutate()}
          disabled={disableMutation.isPending}
        >
          {disableMutation.isPending ? "Disabling..." : "Disable 2FA"}
        </Button>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <p
          className={`text-sm ${
            statusMessage.startsWith("Error") ? "text-red-500" : "text-green-600"
          }`}
        >
          {statusMessage}
        </p>
      )}
    </div>
  );
};
