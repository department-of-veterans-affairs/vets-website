import React from 'react';
import { COE_ELIGIBILITY_STATUS } from './../../constants';
import COEAvailable from './COEStatuses/COEAvailable';
import COEAutomatic from './COEStatuses/COEAutomatic';
import COEPending from './COEStatuses/COEPending';
import COEDenied from './COEStatuses/COEDenied';

const COEIntroPageBox = props => {
  let content;
  if (props.coe.status) {
    switch (props.coe.status) {
      case COE_ELIGIBILITY_STATUS.available:
        content = <COEAvailable />;
        break;
      case COE_ELIGIBILITY_STATUS.eligible:
        content = <COEAutomatic />;
        break;
      case COE_ELIGIBILITY_STATUS.pending:
      case COE_ELIGIBILITY_STATUS.pendingUpload:
        content = <COEPending status={props.coe.status} />;
        break;
      case COE_ELIGIBILITY_STATUS.denied:
        content = <COEDenied />;
        break;
      default:
        content = <></>;
    }
  }
  return <>{content}</>;
};

export default COEIntroPageBox;
