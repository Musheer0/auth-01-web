"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

interface ResetPasswordFormProps {
  email?: string;
}

const requestSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const otpSchema = z.object({
  password: z.string().min(6),
  otp: z.string().min(4, "OTP is required"),
});

type RequestValues = z.infer<typeof requestSchema>;
type OTPValues = z.infer<typeof otpSchema>;

export const ResetPasswordForm = ({ email: propEmail }: ResetPasswordFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromURL = searchParams.get("token_id");

  const [tokenId, setTokenId] = useState<string | null>(tokenFromURL);
  const [email, setEmail] = useState<string | undefined>(propEmail || "");
  const [step, setStep] = useState<"request" | "otp">(tokenFromURL ? "otp" : "request");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const form = useForm<RequestValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      email: propEmail || "",
      password: "",
    },
  });

  const otpForm = useForm<OTPValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      password: form.getValues("password"),
      otp: "",
    },
  });

  // Update password in OTP form if changed
  useEffect(() => {
    otpForm.setValue("password", form.getValues("password"));
  }, [form.watch("password")]);

  // Request Reset Password Mutation
  const requestMutation = useMutation({
    mutationFn: async (values: RequestValues) => {
      const emailToUse = propEmail || values.email!;
      return auth01Client.RequestPasswordReset(emailToUse);
    },
    onSuccess: (data) => {
      if ("error" in data) {
        setStatusMessage(`Error: ${data.error}`);
      } else {
        setTokenId(data.tokenId);
        setStep("otp");
        setEmail(propEmail || form.getValues("email"));
        // Update URL param
        router.replace(`?token_id=${data.tokenId}`);
        setStatusMessage("OTP sent! Check your email.");
      }
    },
    onError: (err) => {
      setStatusMessage(`Something went wrong: ${err?.message || err}`);
    },
  });

  // Reset Password Mutation
  const resetMutation = useMutation({
    mutationFn: async (values: OTPValues) => {
      return auth01Client.ResetPassword(tokenId!, values.otp, values.password);
    },
    onSuccess: (data) => {
      if ("error" in data) {
        setStatusMessage(`Error: ${data.error}`);
      } else {
        setStatusMessage("Password reset successful! You can now login.");
      }
    },
    onError: (err) => {
      setStatusMessage(`Something went wrong: ${err?.message || err}`);
    },
  });

  const handleRequestSubmit = (values: RequestValues) => {
    setStatusMessage(null);
    requestMutation.mutate(values);
  };

  const handleResetSubmit = (values: OTPValues) => {
    setStatusMessage(null);
    resetMutation.mutate(values);
  };

  const handleTryAgain = () => {
    setTokenId(null);
    setStep("request");
    setStatusMessage(null);
    router.replace(""); // remove token_id from URL
    form.reset({ email: propEmail || "", password: "" });
    otpForm.reset({ password: "", otp: "" });
  };

  const title = "Reset Password";
  const description = tokenId
    ? `Password reset for ${email}`
    : email
    ? `Password reset for ${email}`
    : "Enter your email and new password to reset";

  return (
    <CardForm title={title} description={description}>
      {step === "request" && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleRequestSubmit)} className="space-y-4">
            {!propEmail && !tokenId && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="Enter your email" disabled={requestMutation.isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="New Password" disabled={requestMutation.isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={requestMutation.isPending}>
              {requestMutation.isPending ? "Sending OTP..." : "Send OTP"}
            </Button>

            {statusMessage && (
              <p className={`text-sm mt-2 ${statusMessage.startsWith("Error") ? "text-red-500" : "text-green-500"}`}>
                {statusMessage}
              </p>
            )}
          </form>
        </Form>
      )}

      {step === "otp" && (
        <Form {...otpForm}>
          <form onSubmit={otpForm.handleSubmit(handleResetSubmit)} className="space-y-4">
            <FormField
              control={otpForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="New Password" disabled={resetMutation.isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter OTP" disabled={resetMutation.isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={resetMutation.isPending}>
              {resetMutation.isPending ? "Resetting..." : "Reset Password"}
            </Button>

            {statusMessage && (
              <>
                <p className={`text-sm mt-2 ${statusMessage.startsWith("Error") ? "text-red-500" : "text-green-500"}`}>
                  {statusMessage}
                </p>
                {/* Show try again only if error after OTP */}
                {statusMessage.startsWith("Error") && (
                  <Button variant="outline" className="mt-2 w-full" onClick={handleTryAgain}>
                    Try Again
                  </Button>
                )}
              </>
            )}
          </form>
        </Form>
      )}
    </CardForm>
  );
};
