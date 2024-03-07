import React from 'react';
import { useSelector } from 'react-redux';

import { Link } from 'react-router-dom-v5-compat';
import { selectUser } from '../selectors/user';
import { SIGN_IN_URL } from '../constants';

export default function LandingPage() {
  const user = useSelector(selectUser);

  return (
    <>
      <div>Landing page</div>

      {user ? (
        <Link to="/dashboard">Dashboard</Link>
      ) : (
        <a href={SIGN_IN_URL}>Sign in or create an account</a>
      )}
    </>
  );
}
