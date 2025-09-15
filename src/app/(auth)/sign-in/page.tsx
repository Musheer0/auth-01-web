import { SignInForm } from '@/components/auth01/sign-in/sign-in-form'
import React, { Suspense } from 'react'

const page = () => {
  return <Suspense>
    <SignInForm/>
  </Suspense>
}

export default page
