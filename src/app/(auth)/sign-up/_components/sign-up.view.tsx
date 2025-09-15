"use client"
import { EmailForm } from '@/components/auth01/sign-up/email-verification-form';
import { SignUpForm } from '@/components/auth01/sign-up/sign-up-form';
import { useSearchParams } from 'next/navigation'
import React from 'react'

const SignUpView = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    if(!token)
  return (
    <EmailForm/>
  )
else
    return(
        <SignUpForm token_id={token}/>
    )
}


export default SignUpView
