import React from 'react';
import { useSelector } from 'react-redux';

import { selectUser } from '../selectors/user';
import { SIGN_IN_URL } from '../constants';

export default function LandingPage() {
  const user = useSelector(selectUser);

  return (
    <>
      <div>Landing page</div>

      {!user && <a href={SIGN_IN_URL}>Sign in or create an account</a>}
    </>
  );
}
