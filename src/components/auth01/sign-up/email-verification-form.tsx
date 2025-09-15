"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CardForm } from "../card-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { auth01Client } from "@/client/auth01-client";
import OAuthBtns from "../oauth/oauth-btns";
import { useRouter } from "next/navigation";
interface EmailFormProps {
  resend?: boolean;
}

// Zod schema
const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormValues = z.infer<typeof emailSchema>;

export const EmailForm = ({ resend }: EmailFormProps) => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const router = useRouter()
  const form = useForm<FormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (email: string) => {
      if (resend) return auth01Client.ResendEmailVerification(email);
      return auth01Client.verifyEmail(email);
    },
    onSuccess: (data) => {
      if ("error" in data) {
        setStatusMessage(`Error: ${data.error}`);
      } else {
        router.push('/sign-in?token='+data.verify_token+'&email='+form.getValues('email'))
        setStatusMessage(resend ? "Verification email resent!" : "Verification email sent!");
      }
    },
    onError: (err) => {
      setStatusMessage(`Something went wrong: ${err?.message || err}`);
    },
  });

  const title = resend ? "Resend Verification" : "Enter Your Email";
  const description = resend
    ? "Enter your email to resend the verification link"
    : "Enter your email to verify your account";

  const onSubmit = (values: FormValues) => {
    setStatusMessage(null);
    mutation.mutate(values.email);
  };

  return (
    <CardForm
      title={title}
      description={description}
      footerText="Already verified?"
      footerLinkText="Login"
      footerLinkHref="/sign-in"
    >
      {!resend && <>
      <OAuthBtns showOr/>
      
      </>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    disabled={mutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
              
          <Button type="submit" className="w-full " disabled={mutation.isPending}>
            {mutation.isPending ? (resend ? "Resending..." : "Submitting...") : resend ? "Resend" : "Continue"}
          </Button>

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
