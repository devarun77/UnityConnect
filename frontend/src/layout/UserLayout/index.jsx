import React from 'react';
import NavbarComponent from '@/Components/Navbar';
import ToastProvider from '@/Components/ToastProvider';

export default function UserLayout({children}) {
  return (
    <div>
      <NavbarComponent/>
      {children}
      <ToastProvider />
      </div>
  )
};
