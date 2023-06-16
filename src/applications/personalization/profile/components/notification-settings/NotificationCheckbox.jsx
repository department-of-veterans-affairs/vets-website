import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { NOTIFICATION_CHANNEL_LABELS } from '../../constants';

export const NotificationCheckbox = props => {
  const label = `Notify me by ${
    NOTIFICATION_CHANNEL_LABELS[props.channelType]
  }`;
  const checked = props.isOptedIn;

  const [showError, setShowError] = useState(false);

  const handleChange = () => {
    setShowError(true);
  };

  const checkboxError = `We're sorry. We had a problem saving your update. Try again.`;

  return (
    <div>
      <VaCheckbox
        checked={checked}
        label={label}
        onVaChange={handleChange}
        error={showError ? checkboxError : null}
      />
    </div>
  );
};

NotificationCheckbox.propTypes = {
  channelType: PropTypes.number.isRequired,
  isOptedIn: PropTypes.bool,
};
