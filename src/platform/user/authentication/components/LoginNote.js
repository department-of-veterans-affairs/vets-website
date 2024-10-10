import React from 'react';

export default ({ isV2 }) => (
  <div id="loginNote">
    {!isV2 && (
      <p className="vads-u-margin-top--3">
        <strong>Note:</strong> We’re moving to a simpler and more modern sign-in
        experience. We’ll remove the My HealtheVet option after{' '}
        <strong>January 31, 2025,</strong> and the DS Logon option after{' '}
        <strong>September 30, 2025.</strong>
      </p>
    )}
    <a href="https://www.va.gov/resources/creating-an-account-for-vagov">
      Learn more about creating a Login.gov or ID.me account
    </a>
  </div>
);
