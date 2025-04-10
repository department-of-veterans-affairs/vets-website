import React, { useEffect } from 'react';
import { login } from 'platform/user/authentication/utilities';

export default function MhvTemporaryAccess() {
  useEffect(() => {
    document.title = 'Access the My HealtheVet sign-in option';
  });
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
      <div className="vads-u-margin-y--6">
        <h2>Having trouble signing in?</h2>
        <p>Contact the administrator who gave you access to this page.</p>
      </div>
    </section>
  );
}
