import React from 'react';
import PropTypes from 'prop-types';
// import { dateFormat } from '../../util/helpers';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { trackingConfig } from '../../util/constants';

const TrackingInfo = ({
  carrier,
  trackingNumber,
  // completeDateTime,
  prescriptionName,
}) => {
  const carrierConfig = trackingConfig[carrier.toLowerCase()];

  const url = carrierConfig
    ? carrierConfig.url + trackingNumber
    : trackingNumber;
  const label = carrierConfig ? carrierConfig.label : carrier;

  return (
    <VaAlert status="info">
      <h2 className="vads-u-margin-y--0" data-testid="track-package">
        <span>Track your package</span>
      </h2>

      <h3 className="vads-u-font-size--lg vads-u-margin-bottom--1">
        Tracking number
      </h3>
      <p data-testid="tracking-number">{trackingNumber}</p>
      <a href={url} rel="noreferrer">
        Track your package with {label}
      </a>
      <>
        <h4 className="vads-u-font-size--base vads-u-line-height--4 vads-u-font-family--sans vads-u-margin-top--0p5 vads-u-margin-bottom--0">
          Prescriptions in this package:
        </h4>
        <ul>
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

    // <div className="clearfix tracking-info vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-top--3 vads-u-border-left--7px vads-u-border-color--primary">
    //   <h2 className="vads-u-margin-y--0" data-testid="track-package">
    //     <va-icon size={4} icon="info" aria-hidden="true" />
    //     <span className="vads-u-margin-left--1">Track your package</span>
    //   </h2>
    //   <h3 className="vads-u-font-size--lg vads-u-margin-bottom--1">
    //     Tracking number
    //   </h3>
    //   <p data-testid="tracking-number">{trackingNumber}</p>
    //   <a href={url} rel="noreferrer">
    //     Track your package with {label}
    //   </a>
    //   <h3 className="vads-u-font-size--lg vads-u-margin-top--3 vads-u-margin-bottom--1">
    //     Delivery details
    //   </h3>
    //   <>
    //     <h4 className="vads-u-font-size--base vads-u-line-height--4 vads-u-font-family--sans vads-u-margin-top--0p5 vads-u-margin-bottom--0p5 vads-u-margin-right--0p5 left">
    //       Delivery service:
    //     </h4>
    //     <span className="vads-u-line-height--4 vads-u-margin-top--0p5 vads-u-margin-bottom--0p5 left">
    //       {label}
    //     </span>
    //   </>
    //   <>
    //     <h4 className="vads-u-font-size--base vads-u-line-height--4 vads-u-font-family--sans vads-u-margin-top--0p5 vads-u-margin-bottom--0p5 vads-u-margin-right--0p5 left">
    //       Shipped on:
    //     </h4>
    //     <span
    //       data-testid="shipping-date"
    //       className="vads-u-line-height--4 vads-u-margin-top--0p5 vads-u-margin-bottom--0p5 left"
    //     >
    //       {dateFormat(completeDateTime, 'MMMM D, YYYY')}
    //     </span>
    //   </>
    //   <>
    //     <h4 className="vads-u-font-size--base vads-u-line-height--4 vads-u-font-family--sans vads-u-margin-top--0p5 vads-u-margin-bottom--0 vads-u-margin-right--0p5 left">
    //       Prescriptions in this package:
    //     </h4>
    //     <span
    //       className="vads-u-line-height--4 vads-u-margin-top--0p5 vads-u-margin-bottom--0 left"
    //       data-testid="rx-name"
    //       data-dd-privacy="mask"
    //     >
    //       {prescriptionName}
    //     </span>
    //   </>
    // </div>
  );
};

TrackingInfo.propTypes = {
  carrier: PropTypes.string,
  completeDateTime: PropTypes.string,
  prescriptionName: PropTypes.string,
  trackingNumber: PropTypes.string,
};

export default TrackingInfo;
