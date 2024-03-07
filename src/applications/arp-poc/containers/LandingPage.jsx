import React from 'react';

import { SIGN_IN_URL } from '../constants';

export default function LandingPage() {
  return (
    <>
      <div>Landing page</div>

      <a href={SIGN_IN_URL}>Sign in or create an account</a>
    </>
  );
}
