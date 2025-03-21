"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export default function AuthPage() {
  // Track loading state
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignIn = async () => {
    try {
      // Show the loading spinner
      setLoading(true);

      // Sign in
      const data = await authClient.signIn.social({
        provider: "google",
    callbackURL: "/",

      });

      return data;
    } catch (e) {
      // Add a log for debugging
      console.log("An error occured while signing in: ", e);

      // Show an error toast
      toast.error(
        "An error occured while signing you in, please try again later",
      );
    } finally {
      // Hide the loading spinner
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            ScamShield
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-gray-600">
            Secure your online experience with AI-powered scam detection.
          </p>

          <Separator className="my-4" />

          <Button
            onClick={handleSignIn}
            disabled={loading}
            variant="default"
            className="w-full flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <FcGoogle className="h-5 w-5" />
            )}
            {loading ? "Signing you in..." : "Sign in with Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
