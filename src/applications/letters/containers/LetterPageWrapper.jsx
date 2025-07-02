import React from 'react';
import { Outlet } from 'react-router-dom-v5-compat';

export function LetterPageWrapper() {
  return (
    <div className="usa-width-three-fourths letters">
      <h1 id="letters-title-id" data-testid="form-title">
        Your VA benefit letters and documents
      </h1>
      <p className="va-introtext">
        When you apply for a benefit based on your VA status, you may need to
        provide a VA benefit letter or other documentation to prove you’re
        eligible.
      </p>
      <Outlet />
    </div>
  );
}

export default LetterPageWrapper;
