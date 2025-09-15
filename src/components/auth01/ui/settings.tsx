"use client"
import React from 'react'
import UserInfo from './user-info'
import SettingsTab from './settings-tab'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import PrivacyTab from './privacy-tab'
import SessionsTab from './session-tab'

const Settings = () => {
  return (
    <div className='p-3 w-full h-full '>
      <UserInfo/>
    <Tabs
    defaultValue='privacy'
    >
        <SettingsTab/>
        <TabsContent value='privacy'>
          <PrivacyTab/>
        </TabsContent>
        <TabsContent value='sessions'>
          <SessionsTab/>
        </TabsContent>
    </Tabs>
   
    </div>
  )
}

export default Settings
