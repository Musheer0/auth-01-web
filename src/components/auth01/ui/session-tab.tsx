"use client"
import { auth01Client } from '@/client/auth01-client'
import { Auth01User } from '@/client/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import {useQueryClient } from '@tanstack/react-query'

import Link from 'next/link'
import React from 'react'

const SessionsTab = () => {
      const client = useQueryClient()
      const user = client.getQueryData<Auth01User>(['session'])
if(user)
  return (
    <div className='flex flex-col gap-3 max-w-lg mx-auto'>
        <div className="actions flex items-center gap-4">
            <Button
            variant={'destructive'}
            onClick={()=>{
                auth01Client.logout().then(()=>{
                    window.location.replace('/sign-in')
                })
            }}
            size={'sm'}>
               Logout
            </Button>
            <Button
            variant={'destructive'}
            onClick={()=>{
                auth01Client.logout().then(()=>{
                    window.location.replace('/sign-in')
                })
            }}
            size={'sm'}>
               Logout of All device
            </Button>
        </div>
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
    </div>
  )
}

export default SessionsTab
