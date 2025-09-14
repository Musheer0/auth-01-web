import { GoogleSignInButton } from '@/components/auth01/oauth/google/login-google-button'
import { ResetPasswordForm } from '@/components/auth01/reset-password/reset-password-form'
import { SignInForm } from '@/components/auth01/sign-in/sign-in-form'
import { EmailForm } from '@/components/auth01/sign-up/email-verification-form'
import { SignUpForm } from '@/components/auth01/sign-up/sign-up-form'
import { TwoFAForm } from '@/components/auth01/two-fa/twofa-otp-form'
import { TwoFASettings } from '@/components/auth01/ui/2fa-state'
import InitializeUser from '@/components/auth01/user/initialize-user'
import React from 'react'

const page = () => {
  return (
 <InitializeUser>
     <div>
      <SignInForm/>
      <TwoFAForm/>
      <TwoFASettings/>

      {/* <ResetPasswordForm/> */}
      {/* <EmailForm resend/> */}
      <GoogleSignInButton/>
      {/* <SignUpForm token_id='7ba3e9e5-b9c6-45d1-b301-0cf06a9315d2'/> */}
    </div>
 </InitializeUser>
  )
}

export default page
