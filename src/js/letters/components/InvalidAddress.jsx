import React from 'react';

const InvalidAddress = () => (
  <div className="step-content">
    <div id="invalidAddress">
      <div className="usa-alert usa-alert-error">
        <div className="usa-alert-body">
          <h2 className="usa-alert-heading">Address unavailable</h2>
          <p className="usa-alert-text">
            We’re encountering an error with your address information. This is not required for your letters, but if you’d like to see the address we have on file, or to update it, please visit <a href="/" target="_blank">this link</a>.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default InvalidAddress;
