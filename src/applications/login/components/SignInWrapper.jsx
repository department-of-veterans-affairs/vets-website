import React from 'react';

export default function SignInWrapper({ children }) {
  return (
    <main className="login">
      <div className="container">{children}</div>
    </main>
  );
}
