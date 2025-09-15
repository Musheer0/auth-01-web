"use client"
import { Auth01User } from '@/client/types'
import { useQueryClient } from '@tanstack/react-query'
import { ShieldCheckIcon } from 'lucide-react'
import React from 'react'

const UserInfo = () => {
  const client = useQueryClient()
  const user = client.getQueryData<Auth01User>(['session'])
  if(user)
  return (
    <div className='flex flex-col justify-center items-center gap-2'>
      <div className='w-10 h-10 bg-cover bg-red-600 rounded-2xl'
      style={{
        backgroundImage:`url(${user.image_url})`
      }}
      ></div>
      <div className="info text-center">
        <p className='text-xl font-semibold leading-none'>{user.name}</p>
        <p className='leading-none text-sm text-muted-foreground flex items-center gap-1'>{user.primary_email}

          <span title='verified email'>
            {user.is_verified && <ShieldCheckIcon size={16}/>}
          </span>
        </p>
     
      </div>
    </div>
  )
}

export default UserInfo
