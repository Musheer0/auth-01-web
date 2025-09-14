"use client";

import { auth01Client } from '@/client/auth01-client';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'
 
const page = () => {
  const router = useRouter()
    const searchparams= useSearchParams();
     const [code ,state,scope,prompt,authuser] = [
    searchparams.get('code'), 
    searchparams.get('state'),
    searchparams.get('scope'),
    searchparams.get('prompt'),
    searchparams.get('authuser'),
];
    const {isPending} = useQuery({
        queryKey: ['google-auth-callback', searchparams.get('code')],
        queryFn:async()=>{
            if(!code ||!scope || !state || !prompt||!authuser) throw new Error('Missing required parameters');
            const res = await auth01Client.HandleGoogleCallback({code,scope,prompt,authuser,state});
            if('error' in res) throw new Error(res.error);
            router.push('/test')
            return res;
        },
        refetchOnWindowFocus:false
    });
  return (
    <div>
        {isPending && 'Loading...'}
      {code}
      <br/>
      {state}
      <br/>
      {scope}
      <br/> 
      {prompt}
    </div>
  )
}

export default page
