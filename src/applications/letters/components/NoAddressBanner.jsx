import React from 'react';

const noAddressBanner = (
  <div className="usa-alert usa-alert-warning">
    <div className="usa-alert-body">
      <h3 className="usa-alert-heading">
        VA does not have a valid address on file for you
      </h3>
      <div className="usa-alert-text">
        You will need to update your address before we can provide you any
        letters.
      </div>
    </div>
  </div>
);

export default noAddressBanner;
