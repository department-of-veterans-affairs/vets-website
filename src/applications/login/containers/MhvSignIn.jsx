import React from 'react';
import LoginButton from 'platform/user/authentication/components/LoginButton';
import LoginInfo from 'platform/user/authentication/components/LoginInfo';

export default function MhvSignIn() {
  return (
    <div>
      <va-checkbox
        required
        label="I am authorized to use this"
        message-aria-describedby="I am authorized to use this"
        enable-analytics
      />
      <LoginButton csp="mhv" key="mhv" useOAuth={false} />
      <LoginInfo />
    </div>
  );
}
