import React from 'react';
import { Outlet } from 'react-router-dom-v5-compat';

import UserNav from '../components/UserNav';

export default function Layout() {
  return (
    <>
      <UserNav />
      <Outlet />
    </>
  );
}
