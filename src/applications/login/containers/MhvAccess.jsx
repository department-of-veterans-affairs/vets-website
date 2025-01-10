import React from 'react';
import { login } from 'platform/user/authentication/utilities';

export default function MhvAccess() {
  return (
    <section className="container row login vads-u-padding--3">
      <div className="columns small-12 vads-u-padding--0">
        <h1 id="signin-signup-modal-title">
          Get temporary access to My HealtheVet
        </h1>
        <p className="vads-u-measure--5">
          Some groups are approved to access the My HealtheVet sign-in option
          until they create a new modern account. This sign-in process may
          change in the future.
        </p>
      </div>
      <div className="vads-u-margin-y--2">
        <va-button
          onClick={() => login({ policy: 'mhv' })}
          text="Sign in with My HealtheVet"
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
