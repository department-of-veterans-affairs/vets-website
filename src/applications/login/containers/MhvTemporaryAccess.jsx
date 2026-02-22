import React, { useEffect, useState } from 'react';
import { login } from 'platform/user/authentication/utilities';
import { AUTHN_SETTINGS } from 'platform/user/authentication/constants';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import { signInAppCSS } from '../constants';

export default function MhvTemporaryAccess() {
  const [manageAcctUrl, setAcctUrl] = useState('');
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const ial2Enforcement = useToggleValue(
    TOGGLE_NAMES.identityIal2FullEnforcement,
  );

  useEffect(
    () => {
      document.title = 'Access the My HealtheVet sign-in option';

      async function createHref() {
        const url = await login({
          policy: 'mhv',
          queryParams: { operation: 'mhv_exception' },
          isLink: true,
          ial2Enforcement,
        });
        setAcctUrl(url);
      }
      createHref();
    },
    [ial2Enforcement],
  );

  return (
    <>
      <style>{signInAppCSS}</style>
      <section className="container row login vads-u-padding--3">
        <div className="columns small-12 vads-u-padding--0">
          <h1 id="signin-signup-modal-title">
            Access the My HealtheVet sign-in option
          </h1>
          <p className="vads-u-measure--5">
            If you received confirmation from VA that we've given you temporary
            access to My HealtheVet, you can sign in here.
          </p>

          <p>
            We'll update this page with new information before we remove this
            option.
          </p>
        </div>
        <h2>Sign in</h2>
        <div className="vads-u-margin-y--2">
          <va-button
            onClick={() =>
              login({
                policy: 'mhv',
                queryParams: { operation: 'mhv_exception' },
                ial2Enforcement,
              })
            }
            text="My HealtheVet"
            data-testid="accessMhvBtn"
          />
        </div>
        <div className="columns small-12 vads-u-padding--0">
          <h2>Manage your account</h2>
          <h3 className="vads-u-margin-top--0">
            Account information and password
          </h3>
          <p className="vads-u-measure--4 vads-u-margin-bottom--0">
            Sign in here and navigate to <strong>Account Information</strong> to
            view your My HealtheVet account activity or change your password.
          </p>
          <va-link-action
            text="Manage your account"
            type="secondary"
            href={manageAcctUrl}
            onClick={() => {
              sessionStorage.setItem(
                AUTHN_SETTINGS.RETURN_URL,
                'https://eauth.va.gov/mhv-portal-web/eauth?deeplinking=account-information',
              );
            }}
            data-testid="updateMhvBtn"
          />
          <h2>Help and support</h2>
          <p>
            For all other questions, contact the administrator who gave you
            access to this page.
          </p>
        </div>
      </section>
    </>
  );
}
