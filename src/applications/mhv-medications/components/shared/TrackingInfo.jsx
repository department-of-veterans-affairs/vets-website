import React from 'react';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { trackingConfig } from '../../util/constants';

const TrackingInfo = ({ carrier, trackingNumber, prescriptionName }) => {
  const carrierConfig = trackingConfig[carrier.toLowerCase()];

  const url = carrierConfig
    ? carrierConfig.url + trackingNumber
    : trackingNumber;
  const label = carrierConfig ? carrierConfig.label : carrier;

  return (
    <VaAlert status="info" className="tracking-alert">
      <h2 className="vads-u-margin-y--0" data-testid="track-package">
        <span>Track the shipment of your most recent refill</span>
      </h2>

      <p className="vads-u-font-size--source-sans-normalized vads-u-font-family--sans vads-u-font-weight--bold vads-u-margin-bottom--1 vads-u-margin-top--1">
        Tracking number:
      </p>
      <p data-testid="tracking-number" className="vads-u-line-height--1">
        {trackingNumber}
      </p>
      <a href={url} rel="noreferrer">
        Track your package with {label}
      </a>
      <>
        <p
          className="vads-u-line-height--4 vads-u-font-family--sans vads-u-margin-top--2 vads-u-margin-bottom--0"
          data-testid="prescription-info"
        >
          <strong>Prescriptions in this package:</strong>
        </p>
        <ul className="tracking-info-med-list vads-u-margin-top--0">
          <li>
            <span
              className="vads-u-line-height--4 vads-u-margin-top--0p5 vads-u-margin-bottom--0"
              data-testid="rx-name"
              data-dd-privacy="mask"
            >
              {prescriptionName}
            </span>
          </li>
        </ul>
      </>
    </VaAlert>
  );
};

TrackingInfo.propTypes = {
  carrier: PropTypes.string,
  completeDateTime: PropTypes.string,
  prescriptionName: PropTypes.string,
  trackingNumber: PropTypes.string,
};

export default TrackingInfo;
