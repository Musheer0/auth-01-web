"use client"
import { auth01Client } from '@/client/auth01-client';
import React from 'react';

const InitializeUser = ({ children }: { children: React.ReactNode }) => {

  return (
   <div>
    <button
    onClick={()=>{
        auth01Client.logout()
    }}
    >
        Test
    </button>
    {children}
   </div>
  );
};

export default InitializeUser;