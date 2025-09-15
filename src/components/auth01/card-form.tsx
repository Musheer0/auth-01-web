import { FC, ReactNode } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";

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
    <Card className="w-full  rounded-3xl  max-w-sm mx-auto p-6">
      <CardHeader className="text-center">
        <div className="logo mx-auto  py-0  px-10 radial-mask">
          <Image src={'/logo.svg'} alt="logo" width={50} height={50}/>
        </div>
        <CardTitle className="leading-none text-xl">{title}</CardTitle>
        {description && <CardDescription className="leading-none">{description}</CardDescription>}
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
