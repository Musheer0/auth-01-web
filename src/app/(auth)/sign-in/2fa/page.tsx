import { TwoFAForm } from '@/components/auth01/two-fa/twofa-otp-form'
import React, { Suspense } from 'react'

const page = () => {
  return <Suspense>
    <TwoFAForm/>
  </Suspense>
}

export default page
