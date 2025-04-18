import React from 'react';
import { useLoaderData } from 'react-router-dom';

const AuthCallbackHandler = () => {
  useLoaderData();

  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <div className="vads-l-row">
        <div className="vads-l-col--12 vads-u-padding-y--5">
          <h1>Processing your sign in</h1>
          <p>Please wait while we verify your credentials...</p>
          <va-loading-indicator message="Verifying your account..." />
        </div>
      </div>
    </div>
  );
};

export default AuthCallbackHandler;
