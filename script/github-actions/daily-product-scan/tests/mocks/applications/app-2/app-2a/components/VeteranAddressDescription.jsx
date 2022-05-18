import React from 'react';

export const VeteranAddressDescription = () => (
  <div className="vads-u-margin-bottom--4">
    <h3 className="vads-u-font-size--h4">Mailing Address</h3>
    <p>
      We’ll send any important information about your application to this
      address.
    </p>
    <p className="vads-u-margin-bottom--0">
      Updates you make here{' '}
      <strong>will only apply to this application.</strong> To update your
      contact information for all of your VA accounts, please go to your profile
      page.{' '}
    </p>
    <a href="/profile">
      Go to your profile page to update your contact information
    </a>
  </div>
);
