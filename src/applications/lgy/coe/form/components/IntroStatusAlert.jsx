import React from 'react';
import PropTypes from 'prop-types';
import { COE_ELIGIBILITY_STATUS } from '../../shared/constants';
import { Available } from './IntroStatusAlerts/Available';
import { Denied } from './IntroStatusAlerts/Denied';
import { Eligible } from './IntroStatusAlerts/Eligible';
import { Pending } from './IntroStatusAlerts/Pending';
import { PendingUpload } from './IntroStatusAlerts/PendingUpload';

export const IntroStatusAlert = ({ referenceNumber, requestDate, status }) => {
  if (status) {
    switch (status) {
      case COE_ELIGIBILITY_STATUS.available:
        return (
          <Available
            referenceNumber={referenceNumber}
            requestDate={requestDate}
          />
        );
      case COE_ELIGIBILITY_STATUS.denied:
        return (
          <Denied referenceNumber={referenceNumber} requestDate={requestDate} />
        );
      case COE_ELIGIBILITY_STATUS.eligible:
        return <Eligible referenceNumber={referenceNumber} />;
      case COE_ELIGIBILITY_STATUS.pending:
        return (
          <Pending
            referenceNumber={referenceNumber}
            requestDate={requestDate}
          />
        );
      case COE_ELIGIBILITY_STATUS.pendingUpload:
        return (
          <PendingUpload
            referenceNumber={referenceNumber}
            requestDate={requestDate}
          />
        );
      default:
        return null;
    }
  }
  return null;
};

IntroStatusAlert.propTypes = {
  referenceNumber: PropTypes.string,
  requestDate: PropTypes.number,
  status: PropTypes.string,
};
