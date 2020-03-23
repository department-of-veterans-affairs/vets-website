import React from 'react';
import SignInApp from './SignInApp';

export default function App({ children }) {
  return (
    <>
      <SignInApp />
      {children}
    </>
  );
}
