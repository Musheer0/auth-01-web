"use client"
import { auth01Client } from '@/client/auth01-client'
import { Auth01User } from '@/client/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const PrivacyTab = () => {
      const client = useQueryClient()
      const user = client.getQueryData<Auth01User>(['session'])
    const {mutate,isPending} = useMutation({
        mutationFn: () => {
    return user?.twofa_enabled
      ? auth01Client.Disable2fa()
      : auth01Client.Enable2fa();
  },
        onSuccess:(data)=>{
           if(data.success){
            client.setQueryData<Auth01User>(['session'],(old)=>{
                if(!old) return old
                return {
                    ...old,
                    twofa_enabled:!old.twofa_enabled,
                    twofa_enabled_at:new Date()
                }
            })
           }
           if(data.error){
            alert(data.error)
           }
        }
    })
  return (
    <div className='flex flex-col gap-3 max-w-lg mx-auto'>
      <Card >
        <CardContent className='flex items-center gap-3 flex-wrap'>
            <div className='info '>
                <CardTitle>
                Two Factor Authentication
            </CardTitle>
            <CardDescription>
                Enable two factor authentication for extra security during login
            </CardDescription>
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button 
                    disabled={isPending}
                    size={'sm'}>
              {user?.twofa_enabled ? 'Disable 2fa':'  Enable 2fa'}
            {isPending && <Loader2Icon className='animate-spin'/>}
            </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>
                        Are your sure
                    </DialogTitle>
                    <DialogDescription>
                        By enabling two factor authentication you will be forced to do email verification each time you login
                    </DialogDescription>
                  <DialogFooter>
                      <DialogClose asChild>
                    <Button variant={'destructive'}>
                        Cancle
                    </Button>
                    </DialogClose>
                    <DialogClose asChild>
                         <Button
                         onClick={()=>mutate()}
                         >
                        {user?.twofa_enabled ? 'Disable 2fa':'  Enable 2fa'}
                    </Button>
                    </DialogClose>
                        </DialogFooter>
                </DialogContent>
            </Dialog>
        </CardContent>
      </Card>
      <Card>
        <CardContent  className='flex items-center gap-3 flex-wrap'>
            <div className='info '>
                <CardTitle>
                Change Password
            </CardTitle>
            <CardDescription>
                Change your password frequently for more security
            </CardDescription>
            </div>
           <Link href={'/reset-password'}>
            <Button size={'sm'}>
                Change Password
            </Button>
           </Link>
        </CardContent>
      </Card>
        <Button
                  variant={'destructive'}
                  onClick={()=>{
                      auth01Client.logout().then(()=>{
                          window.location.replace('/sign-in')
                      })
                  }}
                  className='w-fit ml-auto'
                  size={'sm'}>
                     Logout
                  </Button>
    </div>
  )
}

export default PrivacyTab
