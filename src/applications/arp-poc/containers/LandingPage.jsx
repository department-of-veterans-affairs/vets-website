import React from 'react';
import { useSelector } from 'react-redux';

import { Link } from 'react-router-dom-v5-compat';
import { selectUser } from '../selectors/user';
import { SIGN_IN_URL } from '../constants';

export default function LandingPage() {
  return (
    <>
      <div>Landing page</div>
      <UserAction />
    </>
  );
}

function UserAction() {
  const { isLoading, profile } = useSelector(selectUser);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <a href={SIGN_IN_URL}>Sign in or create an account</a>;
  }

  return <Link to="/dashboard">Dashboard</Link>;
}
