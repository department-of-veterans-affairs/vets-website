import React from 'react';

const noAddressBanner = (
  <>
    <va-alert status="warning" className="vads-u-margin-bottom--4">
      <h3 slot="headline">We don’t have a valid address on file for you</h3>
      <div>
        You’ll need to <a href="/profile">update your address</a> before you can
        view and download your VA letters or documents.
      </div>
    </va-alert>
    <p />
  </>
);

export default noAddressBanner;
