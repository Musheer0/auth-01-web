"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { auth01Client } from "@/client/auth01-client";

export const GoogleSignInButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_CALLBACK!;
      alert(redirectUri)
      const result = await auth01Client.RedirectToGoogleSignIn(redirectUri);
      if(typeof result ==='string'){
        window.location.href = result
        return 
      }
      if (result?.error) {
        setError(result.error||'somthing went wrong');
        setLoading(false);
      }
    } catch (err) {
      setError( "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full"
      >
        {loading ? "Redirecting..." : "Sign in with Google"}
      </Button>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
