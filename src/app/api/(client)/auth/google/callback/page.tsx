"use client";

import { auth01Client } from '@/client/auth01-client';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react'
import { FcGoogle } from 'react-icons/fc';

const GoogleCallbackContent = () => {
  const router = useRouter();
  const searchparams = useSearchParams();
  const [code, state, scope, prompt, authuser] = [
    searchparams.get('code'),
    searchparams.get('state'),
    searchparams.get('scope'),
    searchparams.get('prompt'),
    searchparams.get('authuser'),
  ];
  useQuery({
    queryKey: ['google-auth-callback', searchparams.get('code')],
    queryFn: async () => {
      if (!code || !scope || !state || !prompt || !authuser) throw new Error('Missing required parameters');
      const res = await auth01Client.HandleGoogleCallback({ code, scope, prompt, authuser, state });
      if ('error' in res) throw new Error(res.error);
      router.push('/dashboard');
      return res;
    },
    refetchOnWindowFocus: false
  });
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
      <FcGoogle className="text-6xl animate-bounce mb-4" />
      <p className="text-lg font-medium text-gray-700">Signing you in with Google...</p>
      <div className="mt-6 flex justify-center">
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-3 h-3 rounded-full bg-blue-500 animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
                display: "inline-block",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Page = () => (
  <Suspense fallback={
    <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
      <FcGoogle className="text-6xl animate-bounce mb-4" />
      <p className="text-lg font-medium text-gray-700">Preparing Google sign-in...</p>
    </div>
  }>
    <GoogleCallbackContent />
  </Suspense>
);

export default Page;
