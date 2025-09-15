import InitializeUser from '@/components/auth01/user/initialize-user';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <InitializeUser>
        {children}
    </InitializeUser>
  );
};

export default Layout;