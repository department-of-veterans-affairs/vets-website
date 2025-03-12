import React from 'react';
import { Outlet } from 'react-router-dom-v5-compat';

export function LetterPageWrapper() {
  return (
    <div className="usa-width-three-fourths letters">
      <h1 id="letters-title-id" data-testid="form-title">
        Your VA letters and documents
      </h1>
      <p className="va-introtext">
        When you request a VA benefit, you may be asked to provide one of the
        following benefit letters or other documentation to prove you're
        eligible.
      </p>
      <Outlet />
    </div>
  );
}

export default LetterPageWrapper;
