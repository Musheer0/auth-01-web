import { FC, ReactNode } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface CardFormProps {
  title: string;
  description?: string;
  footerText?: string;        // Example: "Don't have an account?"
  footerLinkText?: string;    // Example: "Sign up"
  footerLinkHref?: string;    // Example: "/signup"
  children: ReactNode;
}

export const CardForm: FC<CardFormProps> = ({
  title,
  description,
  footerText,
  footerLinkText,
  footerLinkHref,
  children,
}) => {
  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <CardHeader className="text-center">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent className="space-y-4">{children}</CardContent>

      {(footerText || footerLinkText) && (
        <div className="text-center text-sm text-gray-500 mt-4">
          {footerText}{" "}
          {footerLinkText && footerLinkHref && (
            <Link href={footerLinkHref} className="text-blue-500 hover:underline">
              {footerLinkText}
            </Link>
          )}
        </div>
      )}
    </Card>
  );
};
