import { ResetPasswordForm } from '@/components/auth01/reset-password/reset-password-form'
import React, { Suspense } from 'react'

const page = () => {
  return<Suspense>
     <ResetPasswordForm/>
  </Suspense>
}

export default page
