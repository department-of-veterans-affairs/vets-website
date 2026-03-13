import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';

import { dateFormat, getPrescriptionDetailUrl } from '../../util/helpers';
import {
  IN_PROGRESS_MEDS_DISPLAY_TYPES,
  trackingConfig,
} from '../../util/constants';
import { dataDogActionNames } from '../../util/dataDogConstants';

const Prescription = ({ prescription, displayType }) => {
  const { prescriptionName, trackingList } = prescription;

  const carrier = trackingList?.[0]?.carrier;
  const trackingNumber = trackingList?.[0]?.trackingNumber;

  const carrierConfig = trackingConfig[carrier?.toLowerCase()];
  const trackingUrl = carrierConfig
    ? carrierConfig.url + trackingNumber
    : trackingNumber;

  const getSubtext = () => {
    switch (displayType) {
      case IN_PROGRESS_MEDS_DISPLAY_TYPES.IN_PROGRESS:
        return `Expected fill date: ${dateFormat(prescription.refillDate)}`;
      case IN_PROGRESS_MEDS_DISPLAY_TYPES.SHIPPED:
        return (
          <>
            Date shipped: {dateFormat(trackingList?.[0]?.completeDateTime)} |{' '}
            <a href={trackingUrl} rel="noreferrer">
              Get tracking info
            </a>
          </>
        );
      default:
        return `Request submitted: ${dateFormat(
          prescription.refillSubmitDate,
        )}`;
    }
  };

  return (
    <div>
      <Link
        className="vads-u-font-weight--bold"
        to={getPrescriptionDetailUrl(prescription)}
        data-testid="prescription-link"
        data-dd-action-name={
          dataDogActionNames.inProgressPage.MEDICATION_NAME_LINK
        }
      >
        {prescriptionName}
      </Link>
      <p className="vads-u-margin-top--0">{getSubtext()}</p>
    </div>
  );
};

Prescription.propTypes = {
  displayType: PropTypes.string.isRequired,
  prescription: PropTypes.shape({
    prescriptionName: PropTypes.string.isRequired,
    trackingList: PropTypes.arrayOf(
      PropTypes.shape({
        carrier: PropTypes.string,
        completeDateTime: PropTypes.string,
        trackingNumber: PropTypes.string,
      }),
    ),
    refillDate: PropTypes.string,
    refillSubmitDate: PropTypes.string,
  }).isRequired,
};

export default Prescription;
