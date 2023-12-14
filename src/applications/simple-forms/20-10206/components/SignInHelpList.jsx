import React from 'react';

const SignInHelpList = () => {
  const retentionPeriod = '60 days';
  const appType = 'request';

  return (
    <ul part="list">
      <li>We can fill in some of your information for you to save you time.</li>
      <li>
        You can save your work in progress. You’ll have {retentionPeriod} from
        when you start or make updates to your {appType} to come back and finish
        it.
      </li>
      <li>
        You’ll need to log in with an account where you’ve provided some
        personal information to verify your identity. We recommend using{' '}
        <strong>ID.me</strong> or <strong>Login.gov</strong> accounts for
        identity verification.
      </li>
    </ul>
  );
};

export default SignInHelpList;
