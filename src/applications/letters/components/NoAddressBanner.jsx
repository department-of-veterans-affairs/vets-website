import React from 'react';

const noAddressBanner = (
  <div className="usa-alert usa-alert-warning">
    <div className="usa-alert-body">
      <h3 className="usa-alert-heading">
        We don't have a valid address on file for you
      </h3>
      <div className="usa-alert-text">
        You'll need to <a href="/profile">update your address</a> before you can
        view and download your VA letters or documents.
      </div>
    </div>
  </div>
);

export default noAddressBanner;
