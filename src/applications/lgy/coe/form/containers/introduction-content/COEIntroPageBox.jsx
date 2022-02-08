import React from 'react';
import PropTypes from 'prop-types';

import { COE_ELIGIBILITY_STATUS } from '../../../shared/constants';
import COEAvailable from './COEStatuses/COEAvailable';
import COEDenied from './COEStatuses/COEDenied';
import COEEligible from './COEStatuses/COEEligible';
import COEIneligible from './COEStatuses/COEIneligible';
import COEPending from './COEStatuses/COEPending';

const COEIntroPageBox = ({ applicationCreateDate, downloadUrl, status }) => {
  if (status) {
    switch (status) {
      case COE_ELIGIBILITY_STATUS.available:
        return (
          <COEAvailable
            applicationCreateDate={applicationCreateDate}
            downloadUrl={downloadUrl}
          />
        );
      case COE_ELIGIBILITY_STATUS.denied:
        return <COEDenied />;
      case COE_ELIGIBILITY_STATUS.eligible:
        return <COEEligible downloadUrl={downloadUrl} />;
      case COE_ELIGIBILITY_STATUS.ineligible:
      case COE_ELIGIBILITY_STATUS.unableToDetermine:
        return <COEIneligible />;
      case COE_ELIGIBILITY_STATUS.pending:
      case COE_ELIGIBILITY_STATUS.pendingUpload:
        return (
          <COEPending
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

COEIntroPageBox.propTypes = {
  applicationCreateDate: PropTypes.number,
  downloadUrl: PropTypes.string,
  status: PropTypes.string,
};

export default COEIntroPageBox;
