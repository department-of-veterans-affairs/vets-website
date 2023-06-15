import React from 'react';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { NOTIFICATION_CHANNEL_LABELS } from '../../constants';

export const NotificationCheckboxes = props => {
  const label = `Notify me by ${
    NOTIFICATION_CHANNEL_LABELS[props.channelType]
  }`;
  const checked = props.isOptedIn;

  return (
    <div>
      <VaCheckbox checked={checked} label={label} />
    </div>
  );
};
