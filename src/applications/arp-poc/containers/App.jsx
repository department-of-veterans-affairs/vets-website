import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom-v5-compat';

import { fetchUser } from '../actions/user';
import UserNav from '../components/UserNav';

export default function App() {
  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(fetchUser());
    },
    [dispatch],
  );

  return (
    <>
      <UserNav />
      <Outlet />
    </>
  );
}
