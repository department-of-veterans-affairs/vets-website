import React from 'react';
import PropTypes from 'prop-types';

import { COE_ELIGIBILITY_STATUS } from '../../../shared/constants';

import { Available, Denied, Eligible, Ineligible, Pending } from '../statuses';

const IntroPageBox = ({ applicationCreateDate, downloadUrl, status }) => {
  if (status) {
    switch (status) {
      case COE_ELIGIBILITY_STATUS.available:
        return (
          <Available
            downloadUrl={downloadUrl}
            applicationCreateDate={applicationCreateDate}
          />
        );
      case COE_ELIGIBILITY_STATUS.denied:
        return <Denied />;
      case COE_ELIGIBILITY_STATUS.eligible:
        return <Eligible downloadUrl={downloadUrl} />;
      case COE_ELIGIBILITY_STATUS.ineligible:
      case COE_ELIGIBILITY_STATUS.unableToDetermine:
        return <Ineligible />;
      case COE_ELIGIBILITY_STATUS.pending:
      case COE_ELIGIBILITY_STATUS.pendingUpload:
        return (
          <Pending
            applicationCreateDate={applicationCreateDate}
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
  applicationCreateDate: PropTypes.number,
  downloadUrl: PropTypes.string,
  status: PropTypes.string,
};

export default IntroPageBox;
