import React from 'react';
import { LoginButton } from '~/platform/user/exportsFile';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function CreateAccount() {
  const cspInfo = ['logingov', 'idme'];
  return (
    <div
      className="vads-u-display--flex vads-u-flex-direction--column"
      id="create-account-div"
    >
      <h2 className="vads-u-margin-y--0" id="createAccountH2">
        Create a different account now
      </h2>
      <p id="createAccountP">
        Create an identity-verified <strong>Login.gov</strong> or{' '}
        <strong>ID.me</strong> account now, so you're ready for the change.
      </p>
      <VaLink
        text="Learn about why we are making changes to sign in"
        href="https://www.va.gov/initiatives/prepare-for-vas-secure-sign-in-changes/"
      />
      <div id="button-div">
        {cspInfo.map(c => (
          <LoginButton csp={c} key={c} id={`${c}Button`} />
        ))}
      </div>
    </div>
  );
}
