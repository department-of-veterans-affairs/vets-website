import React from 'react';
import SignInApp from './SignInApp';

export default function App({ children }) {
  return (
    <>
      <header className="login-header">
        <div className="usa-grid-full">
          <div className="header-wrapper">
            <img src="/img/header-logo.png" alt="VA Logo" />
          </div>
        </div>
      </header>
      <div>
        <SignInApp />
        {children}
      </div>
    </>
  );
}
