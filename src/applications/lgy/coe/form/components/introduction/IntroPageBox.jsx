import React from 'react';

import { COE_ELIGIBILITY_STATUS } from '../../../shared/constants';

import { Available, Denied, Eligible, Ineligible, Pending } from '../statuses';

const IntroPageBox = ({ coe, downloadUrl }) => {
  if (coe.status) {
    switch (coe.status) {
      case COE_ELIGIBILITY_STATUS.available:
        return (
          <Available
            downloadUrl={downloadUrl}
            applicationCreateDate={coe.applicationCreateDate}
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
            status={coe.status}
            applicationCreateDate={coe.applicationCreateDate}
          />
        );
      default:
        return <></>;
    }
  }

  return <></>;
};

export default IntroPageBox;
