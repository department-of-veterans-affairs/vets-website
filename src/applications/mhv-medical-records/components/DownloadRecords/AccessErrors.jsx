import React from 'react';
import PropTypes from 'prop-types';
import { SEI_DOMAINS } from '@department-of-veterans-affairs/mhv/exports';
import { accessAlertTypes, documentTypes } from '../../util/constants';
import AccessTroubleAlertBox from '../shared/AccessTroubleAlertBox';

const AccessErrors = ({
  CCDRetryTimestamp,
  failedSeiDomains = [],
  seiPdfGenerationError = false,
}) => {
  // CCD generation Error
  if (CCDRetryTimestamp) {
    return (
      <AccessTroubleAlertBox
        alertType={accessAlertTypes.DOCUMENT}
        documentType={documentTypes.CCD}
        className="vads-u-margin-bottom--1"
      />
    );
  }
  // SEI Access Error: If all SEI domains failed
  if (failedSeiDomains.length === SEI_DOMAINS.length || seiPdfGenerationError) {
    return (
      <AccessTroubleAlertBox
        alertType={accessAlertTypes.DOCUMENT}
        documentType={documentTypes.SEI}
        className="vads-u-margin-bottom--1"
      />
    );
  }
  return null;
};

AccessErrors.propTypes = {
  CCDRetryTimestamp: PropTypes.string,
  failedSeiDomains: PropTypes.arrayOf(PropTypes.string),
  seiPdfGenerationError: PropTypes.bool,
};

export default AccessErrors;
