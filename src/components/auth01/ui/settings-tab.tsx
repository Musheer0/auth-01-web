"use client"
import { Button } from '@/components/ui/button'
import {TabsList, TabsTrigger } from "@/components/ui/tabs"
import React, { useState } from 'react'

const SettingsTab = () => {
    const tabs = ['privacy']
    const [activeTab,setActiveTab] = useState('privacy')
  return (
     <TabsList
    defaultValue='privacy'
     className='flex items-center h-fit! bg-transparent w-full  max-w-sm mx-auto justify-center py-5 gap-2'>
          {tabs.map((e,i)=>{
        return(
            <React.Fragment key={i}>
             <TabsTrigger
                onClick={()=>{
                    setActiveTab(e)
                }}
             value={e} className='w-full h-full! ' asChild>
               <Button
            
                className='flex-1 cursor-pointer capitalize' 
                variant={activeTab===e ? 'default':'oauth'}
              >
                {e}
              </Button>
             </TabsTrigger>
            </React.Fragment>
        )
      })}

      </TabsList>
  )
}

export default SettingsTab
