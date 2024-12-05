import React from 'react';
import { VerifyButton } from '~/platform/user/exportsFile';
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
          <VerifyButton
            csp={c}
            key={c}
            queryParams={{ operation: 'interstitial_signup' }}
          />
        ))}
      </div>
    </div>
  );
}
