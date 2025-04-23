import React, { useEffect } from 'react';
import { login } from 'platform/user/authentication/utilities';

export default function DSLogonPage() {
  useEffect(() => {
    document.title = 'Access the DS Logon sign-in option';
  }, []);
  return (
    <section className="container row login vads-u-padding--3">
      <div className="columns small-12 vads-u-padding--0">
        <h1 id="signin-signup-modal-title">
          This sign-in option is being removed
        </h1>
        <p className="vads-u-measure--5">
          This sign in option will be removed after September 30, 2025. You’ll
          still be able to use your <strong>DS Logon</strong> account on Defense
          Department websites after this date.
        </p>
      </div>
      <h2>Continue signing in with DS Logon</h2>
      <div className="vads-u-margin-y--2">
        <va-button
          onClick={() =>
            login({
              policy: 'dslogon',
              queryParams: { operation: 'mhv_exception' },
            })
          }
          text="DS Logon"
          data-testid="accessDSLBtn"
        />
      </div>
      <div className="vads-u-margin-y--6">
        <p>
          Would you like to sign-in in with an ID.me or Login.gov account
          instead?
        </p>
        <a href="www.va.gov/sign-in">Return to sign-in page</a>
      </div>
    </section>
  );
}
