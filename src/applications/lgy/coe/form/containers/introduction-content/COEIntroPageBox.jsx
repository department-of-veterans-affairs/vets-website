import React from 'react';

import { COE_ELIGIBILITY_STATUS } from '../../../shared/constants';
import COEAvailable from './COEStatuses/COEAvailable';
import COEDenied from './COEStatuses/COEDenied';
import COEEligible from './COEStatuses/COEEligible';
import COEIneligible from './COEStatuses/COEIneligible';
import COEPending from './COEStatuses/COEPending';

const COEIntroPageBox = props => {
  if (props.coe.status) {
    switch (props.coe.status) {
      case COE_ELIGIBILITY_STATUS.available:
        return <COEAvailable />;
      case COE_ELIGIBILITY_STATUS.denied:
        return <COEDenied />;
      case COE_ELIGIBILITY_STATUS.eligible:
        return <COEEligible />;
      case COE_ELIGIBILITY_STATUS.ineligible:
      case COE_ELIGIBILITY_STATUS.unableToDetermine:
        return <COEIneligible />;
      case COE_ELIGIBILITY_STATUS.pending:
      case COE_ELIGIBILITY_STATUS.pendingUpload:
        return <COEPending status={props.coe.status} />;
      default:
        return <></>;
    }
  }

  return <></>;
};

export default COEIntroPageBox;
