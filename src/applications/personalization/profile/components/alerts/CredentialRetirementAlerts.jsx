import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useSignInServiceProvider } from '../../hooks';
import { HowToVerifyLink } from '~/platform/user/authorization/components/IdentityNotVerified';
import { useSessionStorage } from '../../../common/hooks/useSessionStorage';

// alerts to be used during the transition period of MHV and DS Logon credential retirement

export const AccountSecurityLoa1CredAlert = () => {
  const { label } = useSignInServiceProvider();

  return (
    <>
      <VaAlert status="continue" visible uswds>
        <h2 slot="headline">
          Verify your identity with Login.gov or ID.me to manage your profile
          information
        </h2>
        <div>
          <p>
            Before we give you access to your VA.gov profile, we need to make
            sure you’re you—and not someone pretending to be you. This helps us
            protect your identity and prevent fraud.
          </p>
          <p>
            If you have a verified Login.gov or ID.me account, sign out now.
            Then sign back in with that account to continue.
          </p>
          <p>
            {`If you don’t have one of these accounts, you can create one and
            verify your identity now. Starting December 31, 2024, you’ll no
            longer be able to sign in with your ${label} username and password.`}
          </p>

          <va-link
            href="/resources/creating-an-account-for-vagov/"
            text="Learn how to create an account"
          />

          <p className="vads-u-margin-bottom--0">
            <strong>Note:</strong> If you need help updating your personal
            information, call us at{' '}
            <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
            <va-telephone contact={CONTACTS['711']} tty />
            ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
          </p>
        </div>
      </VaAlert>

      <HowToVerifyLink />
    </>
  );
};

export const SignInEmailAlert = () => {
  const { label } = useSignInServiceProvider();

  const [dismissed, setDismissed] = useSessionStorage(
    'dismissedCredentialAlerts',
  );

  const hideAlert = () => {
    setDismissed('true');
  };

  return (
    <VaAlert
      onCloseEvent={hideAlert}
      status="continue"
      visible={dismissed !== 'true'}
      uswds
      class={!dismissed && 'vads-u-margin-bottom--3'}
      closeable
    >
      <div>
        <p className="vads-u-margin-top--0">
          {`Starting December 31, 2024, you’ll no longer be able to sign in with
          your ${label} username and password. You’ll need to use a verified
          Login.gov or ID.me account to access your profile.`}
        </p>

        <p>
          If you don’t have one of these accounts, you can create one and verify
          your identity now.
        </p>

        <va-link
          href="/resources/creating-an-account-for-vagov/"
          text="Learn how to create an account"
        />
      </div>
    </VaAlert>
  );
};
