import React from 'react';

export default function NoAddressBanner() {
  return (
    <>
      <va-alert
        status="warning"
        className="vads-u-margin-bottom--4"
        uswds="false"
      >
        <h3 slot="headline">We don’t have a valid address on file for you</h3>
        <div>
          You’ll need to{' '}
          <a href="/profile/contact-information">update your address</a> before
          you can view and download your VA letters or documents.
        </div>
      </va-alert>
      <p />
    </>
  );
}
