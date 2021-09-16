import React from 'react';
import COEAvailable from './COEStatuses/COEAvailable';
import COEAutomatic from './COEStatuses/COEAutomatic';
import COEPending from './COEStatuses/COEPending';
import COEDenied from './COEStatuses/COEDenied';

const COEIntroPageBox = props => {
  let content;
  if (props.coe.status) {
    switch (props.coe.status) {
      case 'available':
        content = <COEAvailable />;
        break;
      case 'eligible':
        content = <COEAutomatic />;
        break;
      case 'pending' || 'pending-upload':
        content = <COEPending status={props.coe.status} />;
        break;
      case 'denied':
        content = <COEDenied />;
        break;
      default:
    }
  }
  return <>{content}</>;
};

export default COEIntroPageBox;
