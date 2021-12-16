import React from 'react';

export default function SignInWrapper({ children }) {
  return (
    <section className="login">
      <div className="container">{children}</div>
    </section>
  );
}
