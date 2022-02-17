import React from 'react';
import PropTypes from 'prop-types';

import { COE_ELIGIBILITY_STATUS } from '../../../shared/constants';
import { Available, Denied, Eligible, Ineligible, Pending } from '../statuses';

const IntroPageBox = ({
  downloadUrl,
  referenceNumber,
  requestDate,
  status,
}) => {
  if (status) {
    switch (status) {
      case COE_ELIGIBILITY_STATUS.available:
        return (
          <Available
            downloadUrl={downloadUrl}
            referenceNumber={referenceNumber}
            requestDate={requestDate}
          />
        );
      case COE_ELIGIBILITY_STATUS.denied:
        return (
          <Denied referenceNumber={referenceNumber} requestDate={requestDate} />
        );
      case COE_ELIGIBILITY_STATUS.eligible:
        return (
          <Eligible
            downloadUrl={downloadUrl}
            referenceNumber={referenceNumber}
          />
        );
      case COE_ELIGIBILITY_STATUS.ineligible:
      case COE_ELIGIBILITY_STATUS.unableToDetermine:
        return <Ineligible />;
      case COE_ELIGIBILITY_STATUS.pending:
      case COE_ELIGIBILITY_STATUS.pendingUpload:
        return (
          <Pending
            origin="form"
            referenceNumber={referenceNumber}
            requestDate={requestDate}
            status={status}
          />
        );
      default:
        return <></>;
    }
  }

  return <></>;
};

IntroPageBox.propTypes = {
  downloadUrl: PropTypes.string,
  referenceNumber: PropTypes.string,
  requestDate: PropTypes.number,
  status: PropTypes.string,
};

export default IntroPageBox;
