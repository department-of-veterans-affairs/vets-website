import React from 'react';

const UpdateFailureAlert = ({ addressObject, recipientName }) => {
  const addressLines = Object.keys(addressObject).map(key => (
    <div className="letters-address" key={key}>
      {addressObject[key]}
    </div>
  ));
  return (
    <div className="usa-alert usa-alert-warning">
      <div className="usa-alert-body">
        <h4 className="usa-alert-heading">Address update unsuccessful</h4>
        <div className="usa-alert-text">
          <div>
            We weren't able to save your updated address. But your{' '}
            <strong>VA letters and documents are still valid</strong> even with
            your old address:
          </div>
          <div className="address-block">
            <h5 className="letters-address">
              {(recipientName || '').toLowerCase()}
            </h5>
            <div id="warning-address-block">{addressLines}</div>
          </div>
          <div>
            <strong>
              Please continue to download your letter or document.
            </strong>{' '}
            You can come back later to update your address.
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateFailureAlert;
