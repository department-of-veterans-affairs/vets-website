import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

export default function UpdateAddressAlert({ onClickUpdateAddress }) {
  const headline =
    'To use some of the tool’s features, you need a home address on file';

  return (
    <AlertBox
      status="warning"
      headline={headline}
      className="vads-u-margin-y--3"
      content={
        <p>
          To update your address, go to your VA.gov profile. Please allow some
          time for your address update to process through our system. <br />
          <a
            className="usa-button usa-button-primary vads-u-margin-top--4"
            target="_blank"
            rel="noopener noreferrer"
            href="/change-address/#how-do-i-change-my-address-in-"
            onClick={() => onClickUpdateAddress(headline)}
          >
            Update your address
          </a>
        </p>
      }
    />
  );
}
