"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { CardForm } from "../card-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { auth01Client } from "@/client/auth01-client";

const twofaSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits"),
});

type FormValues = z.infer<typeof twofaSchema>;

export const TwoFAForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // from query param
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(twofaSchema),
    defaultValues: { otp: "" },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!token) throw new Error("Missing token in URL");
      return auth01Client.verify2fa(token, values.otp);
    },
    onSuccess: (data) => {
      if ("error" in data) {
        setStatusMessage(`Error: ${data.error}`);
      } else {
        setStatusMessage("2FA verified successfully! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard"); // redirect after success
        }, 1500);
      }
    },
    onError: (err) => {
      setStatusMessage(`Something went wrong: ${err?.message || err}`);
    },
  });

  const onSubmit = (values: FormValues) => {
    setStatusMessage(null);
    mutation.mutate(values);
  };

  return (
    <CardForm
      title="Two-Factor Authentication"
      description="Enter the OTP sent to your device"
      footerText="Back to login?"
      footerLinkText="Sign In"
      footerLinkHref="/signin"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* OTP Field */}
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter OTP"
                    disabled={mutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Verifying..." : "Verify OTP"}
          </Button>

          {/* Status Message */}
          {statusMessage && (
            <p
              className={`text-sm mt-2 ${
                statusMessage.startsWith("Error") ? "text-red-500" : "text-green-500"
              }`}
            >
              {statusMessage}
            </p>
          )}
        </form>
      </Form>
    </CardForm>
  );
};
