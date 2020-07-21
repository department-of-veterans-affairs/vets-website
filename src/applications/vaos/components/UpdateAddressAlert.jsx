import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function UpdateAddressAlert({ address, showAlert, onHide }) {
  const regexp = /^PO Box/;
  if (showAlert && (!address || address.match(regexp))) {
    return (
      <AlertBox
        status="warning"
        headline="You need to have a home address on file to use some of the tool's features"
        className="vads-u-margin-y--3"
        content={
          <p>
            You can update your address in your VA profile. Please allow some
            time for your address update to process through our system. <br />
            <a
              className="usa-button usa-button-primary vads-u-margin-top--4"
              target="_blank"
              rel="noopener noreferrer"
              href="/change-address/#how-do-i-change-my-address-in-"
              onClick={onHide}
            >
              Update your address
            </a>
          </p>
        }
      />
    );
  }
  return null;
}
