import React from 'react';
import { VaLinkAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function CreateAccount() {
  const cspInfo = [
    { name: 'ID.me', href: '' },
    { name: 'DSLogon', href: 'https://secure.login.gov/sign_up/enter_email' },
  ];
  return (
    <div
      className="vads-u-display--flex vads-u-flex-direction--column"
      id="create-account-div"
    >
      <h2>Create an account now</h2>
      <p>
        You’ll need to sign in with an identity-verified{' '}
        <strong>Login.gov</strong> or <strong>ID.me</strong> account.
      </p>
      <div id="button-div">
        {cspInfo.map(c => (
          <VaLinkAction
            type="secondary"
            key={c.name}
            text={`Create an account with ${c.name}`}
            href={c.href}
            className="vads-u-border-top--1px vads-u-border-bottom--1px vads-u-display--block vads-u-max-width--mobile-lg"
          />
        ))}
      </div>
    </div>
  );
}
