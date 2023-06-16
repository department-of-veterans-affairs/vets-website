import React from 'react';
import PropTypes from 'prop-types';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import uniqueId from 'lodash/uniqueId';
import { NOTIFICATION_CHANNEL_LABELS } from '../../constants';
import { NotificationStatusMessage } from './NotificationStatusMessage';

export const NotificationCheckbox = ({
  errorMessage,
  loadingMessage,
  successMessage,
  channelType,
  isOptedIn,
  onValueChange,
  warningMessage,
}) => {
  const id = uniqueId('notification-checkbox-');
  const label = `Notify me by ${NOTIFICATION_CHANNEL_LABELS[channelType]}`;

  const checked = isOptedIn;

  const handleChange = e => {
    onValueChange(e);
  };

  let errorSpan = '';
  let errorSpanId;
  if (errorMessage) {
    errorSpanId = `${id}-error-message`;
    errorSpan = (
      <NotificationStatusMessage
        id={errorSpanId}
        classes="rb-input-message-error"
        alert
      >
        <i
          className="fas fa-exclamation-circle vads-u-margin-right--1"
          aria-hidden="true"
        />{' '}
        <span className="sr-only">Error</span> {errorMessage}
      </NotificationStatusMessage>
    );
  }

  let loadingSpan = '';
  let loadingSpanId;
  if (loadingMessage) {
    loadingSpanId = `${id}-loading-message`;
    loadingSpan = (
      <NotificationStatusMessage
        id={loadingSpanId}
        classes="vads-u-font-weight--normal"
        alert
      >
        <i
          className="fas fa-spinner fa-spin vads-u-margin-right--1"
          aria-hidden="true"
        />{' '}
        {loadingMessage}
      </NotificationStatusMessage>
    );
  }

  let successSpan = '';
  let successSpanId;
  if (successMessage) {
    successSpanId = `${id}-success-message`;
    successSpan = (
      <NotificationStatusMessage
        id={successSpanId}
        classes="rb-input-message-success"
        alert
      >
        <i
          className="fas fa-check-circle vads-u-margin-right--1"
          aria-hidden="true"
        />{' '}
        <span className="sr-only">Success</span> {successMessage}
      </NotificationStatusMessage>
    );
  }

  return (
    <div>
      {!loadingMessage && !successMessage && !warningMessage && errorSpan}
      {!loadingMessage && !errorMessage && !warningMessage && successSpan}
      {!errorMessage && !successMessage && !warningMessage && loadingSpan}
      {!loadingMessage && (
        <VaCheckbox checked={checked} label={label} onVaChange={handleChange} />
      )}
    </div>
  );
};

NotificationCheckbox.propTypes = {
  channelType: PropTypes.number.isRequired,
  isOptedIn: PropTypes.bool,
};
