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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { auth01Client } from "@/client/auth01-client";
import { useSearchParams } from "next/navigation";

interface SignUpFormProps {
  token_id: string; // <- token_id passed from parent
}

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  otp: z.string().min(4, "OTP is required"),
});

type FormValues = z.infer<typeof signUpSchema>;

export const SignUpForm = ({ token_id }: SignUpFormProps) => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const searchparams = useSearchParams()
  const form = useForm<FormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: searchparams.get('email')||'',
      name: "",
      password: "",
      otp: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      return auth01Client.signUp(
        values.name,
        values.password,
        token_id,
        values.otp
      );
    },
    onSuccess: (data) => {
      if ("error" in data) {
        setStatusMessage(`Error: ${data.error}`);
      } else {
        setStatusMessage("Sign up successful! You can now login.");
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
      title="Sign Up"
      description="Create your account"
      footerText="Already have an account?"
      footerLinkText="Login"
      footerLinkHref="/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            disabled
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="Enter your email" disabled={mutation.isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your name" disabled={mutation.isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="Enter your password" disabled={mutation.isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter OTP" disabled={mutation.isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Signing Up..." : "Sign Up"}
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
