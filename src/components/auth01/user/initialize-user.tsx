"use client"
import { auth01Client } from '@/client/auth01-client';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px'
  }}>
    <div style={{
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #3498db',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      animation: 'spin 1s linear infinite'
    }} />
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}
    </style>
    <div style={{ marginTop: '16px', color: '#3498db', fontWeight: 500 }}>
      Loading user info...
    </div>
  </div>
);

const InitializeUser = ({ children }: { children: React.ReactNode }) => {
  const { data, isPending } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const res = await auth01Client.Me();
      if ('error' in res) {
        throw new Error(res.error);
      }
      return res;
    },
    retry: 3,
    refetchOnWindowFocus: false,
  });

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (data) {
    return <>{children}</>;
  }

  return null;
};

export default InitializeUser;