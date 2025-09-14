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
import Link from "next/link";
import { auth01Client } from "@/client/auth01-client";
import { useRouter } from "next/navigation";


const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  otp:z.string().optional(),
});

type FormValues = z.infer<typeof signInSchema>;

export const SignInForm = () => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      otp:""
    },
  });
const router = useRouter()
  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      return auth01Client.signIn(values.email, values.password);
    },
    onSuccess: (data) => {
      if ("error" in data) {
        setStatusMessage(`Error: ${data.error}`);
      } else {
        if("token" in data){
          router.push(`/twofa?token=${data.token}`)
          setStatusMessage("2FA required. your will be redirected to 2FA page");
          return;
        }
        setStatusMessage("Signed in successfully!");
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
      title="Sign In"
      description="Enter your credentials to login"
      footerText="Don't have an account?"
      footerLinkText="Sign Up"
      footerLinkHref="/signup"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="Enter your email" disabled={mutation.isPending} />
                </FormControl>
                <FormMessage />
                {/* Forgot Password link */}
                <Link href="/reset-password" className="text-sm text-blue-500 hover:underline mt-1 inline-block">
                  Forgot password?
                </Link>
              </FormItem>
            )}
          />
        
          {/* Password */}
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

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Signing In..." : "Sign In"}
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
