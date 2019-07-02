import React from 'react';

const UpdateFailureAlert = () => (
  <div className="usa-alert usa-alert-warning">
    <div className="usa-alert-body">
      <h4 className="usa-alert-heading">
        We aren't able to save your updated address
      </h4>
      <div className="usa-alert-text">
        <div>
          Your VA letters and documents are still valid with your old address.
          <strong>
            Please continue to download your VA letter or document.
          </strong>{' '}
          You can come back later and try again.
        </div>
      </div>
    </div>
  </div>
);

export default UpdateFailureAlert;
