import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className='w-full min-h-screen flex items-center justify-center'>
        {children}
    </section>
  );
};

export default Layout;