import React, { useEffect } from 'react';
import { login } from 'platform/user/authentication/utilities';
import { AUTHN_SETTINGS } from 'platform/user/authentication/constants';

export default function MhvTemporaryAccess() {
  useEffect(() => {
    document.title = 'Access the My HealtheVet sign-in option';
  }, []);
  return (
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
            })
          }
          text="My HealtheVet"
          data-testid="accessMhvBtn"
        />
      </div>
      <div className="columns small-12 vads-u-padding--0">
        <h2>Manage your My HealtheVet account</h2>
        <h3 className="vads-u-margin-top--0">
          View or update account information
        </h3>
        <p className="vads-u-measure--4 vads-u-margin-bottom--0">
          To view your account activity or change your password, sign in here
          and navigate to <strong>Account Information</strong>.
        </p>
        <va-link-action
          text="Manage your account"
          type="secondary"
          onClick={e => {
            e.preventDefault();
            sessionStorage.setItem(
              AUTHN_SETTINGS.RETURN_URL,
              'https://eauth.va.gov/mhv-portal-web/eauth',
            );
            login({
              policy: 'mhv',
              queryParams: { operation: 'mhv_exception' },
            });
          }}
          data-testid="updateMhvBtn"
        />
        <h2>Help and support</h2>
        <h3 className="vads-u-margin-top--0">Recover forgotten password</h3>
        <p className="vads-u-measure--4 vads-u-margin-bottom--0">
          If you forgot your My HealtheVet password, you can submit personal
          information to recover it.
        </p>
        <va-link-action
          text="Recover your password"
          type="secondary"
          href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/forgot-password?action=new"
          data-testid="recoverMhvBtn"
        />
        <h3>Get support</h3>
        <p>
          For all other questions, contact the administrator who gave you access
          to this page.
        </p>
      </div>
    </section>
  );
}
