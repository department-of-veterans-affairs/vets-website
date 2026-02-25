import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';

import { dateFormat } from '../../util/helpers';
import { trackingConfig } from '../../util/constants';

const Prescription = ({
  prescriptionId,
  prescriptionName,
  lastUpdated,
  status,
  carrier,
  trackingNumber,
}) => {
  const carrierConfig = trackingConfig[carrier?.toLowerCase()];
  const trackingUrl = carrierConfig
    ? carrierConfig.url + trackingNumber
    : trackingNumber;

  const getSubtext = () => {
    switch (status) {
      case 'in-progress':
        return `Expected fill date: ${dateFormat(lastUpdated)}`;
      case 'shipped':
        return (
          <>
            Date shipped: {dateFormat(lastUpdated)} |{' '}
            <a href={trackingUrl} rel="noreferrer">
              Get tracking info
            </a>
          </>
        );
      case 'submitted':
      default:
        return `Request submitted: ${dateFormat(lastUpdated)}`;
    }
  };

  return (
    <div>
      <Link
        className="vads-u-font-weight--bold"
        to={`/my-health/medications/${prescriptionId}`}
        data-testid="prescription-link"
      >
        {prescriptionName}
      </Link>
      <p className="vads-u-margin-top--0">{getSubtext()}</p>
    </div>
  );
};

Prescription.propTypes = {
  lastUpdated: PropTypes.string.isRequired,
  prescriptionId: PropTypes.number.isRequired,
  prescriptionName: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  carrier: PropTypes.string,
  trackingNumber: PropTypes.string,
};

export default Prescription;
