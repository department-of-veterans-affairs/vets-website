import React from 'react';

export default function NoAddressBanner() {
  return (
    <>
      <va-alert status="warning" class="vads-u-margin-bottom--4">
        <h2 slot="headline" className="vads-u-font-size--h3">
          We don’t have a valid address on file for you
        </h2>
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
