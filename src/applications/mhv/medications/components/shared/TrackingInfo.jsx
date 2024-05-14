import React from 'react';
import PropTypes from 'prop-types';
import { dateFormat } from '../../util/helpers';

const config = {
  dhl: {
    label: 'DHL',
    url: 'http://webtrack.dhlglobalmail.com/?id=462&trackingnumber=',
  },
  fedex: {
    label: 'FedEx',
    url: 'https://www.fedex.com/fedextrack/?trknbr=',
  },
  ups: {
    label: 'UPS',
    url:
      'http://wwwapps.ups.com/WebTracking/processInputRequest?HTMLVersion=5.0&loc=en_US&Requester=UPSHome&tracknum=',
  },
  usps: {
    label: 'USPS',
    url: 'https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=',
  },
};

const TrackingInfo = ({
  carrier,
  trackingNumber,
  completeDateTime,
  prescriptionName,
}) => {
  const carrierConfig = config[carrier.toLowerCase()];

  const url = carrierConfig
    ? carrierConfig.url + trackingNumber
    : trackingNumber;
  const label = carrierConfig ? carrierConfig.label : carrier;

  return (
    <div className="clearfix tracking-info vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-top--3 vads-u-border-left--7px vads-u-border-color--primary">
      <h2 className="vads-u-margin-y--0" data-testid="track-package">
        <i
          className="fa fa-info-circle vads-u-margin-right--1"
          aria-hidden="true"
        />
        Track your package
      </h2>
      <h3 className="vads-u-font-size--lg vads-u-margin-bottom--1">
        Tracking number
      </h3>
      <p data-testid="tracking-number">{trackingNumber}</p>
      <a href={url} rel="noreferrer">
        Track your package with {label}
      </a>
      <h3 className="vads-u-font-size--lg vads-u-margin-top--3 vads-u-margin-bottom--1">
        Delivery details
      </h3>
      <>
        <h4 className="vads-u-font-size--base vads-u-line-height--4 vads-u-font-family--sans vads-u-margin-top--0p5 vads-u-margin-bottom--0p5 vads-u-margin-right--0p5 left">
          Delivery service:
        </h4>
        <span className="vads-u-line-height--4 vads-u-margin-top--0p5 vads-u-margin-bottom--0p5 left">
          {label}
        </span>
      </>
      <>
        <h4 className="vads-u-font-size--base vads-u-line-height--4 vads-u-font-family--sans vads-u-margin-top--0p5 vads-u-margin-bottom--0p5 vads-u-margin-right--0p5 left">
          Shipped on:
        </h4>
        <span
          data-testid="shipping-date"
          className="vads-u-line-height--4 vads-u-margin-top--0p5 vads-u-margin-bottom--0p5 left"
        >
          {dateFormat(completeDateTime, 'MMMM D, YYYY')}
        </span>
      </>
      <>
        <h4 className="vads-u-font-size--base vads-u-line-height--4 vads-u-font-family--sans vads-u-margin-top--0p5 vads-u-margin-bottom--0 vads-u-margin-right--0p5 left">
          Prescriptions in this package:
        </h4>
        <span
          className="vads-u-line-height--4 vads-u-margin-top--0p5 vads-u-margin-bottom--0 left"
          data-testid="rx-name"
        >
          {prescriptionName}
        </span>
      </>
    </div>
  );
};

TrackingInfo.propTypes = {
  carrier: PropTypes.string,
  completeDateTime: PropTypes.string,
  prescriptionName: PropTypes.string,
  trackingNumber: PropTypes.string,
};

export default TrackingInfo;
