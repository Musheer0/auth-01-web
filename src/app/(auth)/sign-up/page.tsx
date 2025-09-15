import React, { Suspense } from 'react'
import SignUpView from './_components/sign-up.view'

const page = () => {
  return <Suspense>
    <SignUpView/>
  </Suspense>
}

export default page
