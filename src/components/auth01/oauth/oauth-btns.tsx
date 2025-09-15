import React from 'react'
import { GoogleSignInButton } from './google/login-google-button'
import { GithubSignInButton } from './google/login-github-button'

const OAuthBtns = ({showOr}:{showOr?:boolean}) => {
  return (
   <>
    <div className='flex w-full items-center gap-3 flex-wrap'>
      <GoogleSignInButton/>
      <GithubSignInButton/>
    </div>
    {showOr &&
    <div className="w-full my-5  flex items-center justify-center  bg-muted-foreground/30 h-[0.1px] relative">
        <p className="bg-background text-muted-foreground px-2">or</p>
      </div>
    }
   </>
  )
}

export default OAuthBtns
