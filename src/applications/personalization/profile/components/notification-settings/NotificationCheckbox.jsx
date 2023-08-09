import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { NOTIFICATION_CHANNEL_LABELS } from '../../constants';
import { NotificationStatusMessage } from './NotificationStatusMessage';

export const NotificationCheckbox = ({
  channelId,
  channelType,
  isOptedIn,
  onValueChange,
  loadingMessage,
  successMessage,
  errorMessage,
  disabled,
  last,
  defaultSendIndicator,
}) => {
  const label = `Notify me by ${NOTIFICATION_CHANNEL_LABELS[channelType]}`;

  const checked = useMemo(
    () => {
      if (isOptedIn === null) {
        return defaultSendIndicator;
      }
      return !!isOptedIn;
    },
    [isOptedIn, defaultSendIndicator],
  );

  const handleChange = e => {
    onValueChange(e);
  };

  const checkboxId = `checkbox-${channelId}`;

  let errorSpan = '';
  let errorSpanId;
  if (errorMessage) {
    errorSpanId = `${channelId}-error-message`;
    errorSpan = (
      <NotificationStatusMessage
        id={errorSpanId}
        classes="vads-u-background-color--secondary-lightest vads-u-font-weight--bold"
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
    loadingSpanId = `${channelId}-loading-message`;
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
    successSpanId = `${channelId}-success-message`;
    successSpan = (
      <NotificationStatusMessage
        id={successSpanId}
        classes="vads-u-background-color--green-lightest vads-u-font-weight--bold"
        alert
      >
        <i className="fas fa-check vads-u-margin-right--1" aria-hidden="true" />{' '}
        <span className="sr-only">Success</span> {successMessage}
      </NotificationStatusMessage>
    );
  }

  return (
    <div>
      {!loadingMessage && !successMessage && errorSpan}
      {!loadingMessage && !errorMessage && successSpan}
      {!errorMessage && !successMessage && loadingSpan}
      {!loadingMessage && (
        <VaCheckbox
          checked={checked}
          enableAnalytics
          messageAriaDescribedby=""
          label={label}
          onVaChange={handleChange}
          data-testid={checkboxId}
          id={checkboxId}
          disabled={disabled}
          uswds
          className={last ? 'vads-u-padding-bottom--0p5' : ''}
        />
      )}
    </div>
  );
};

NotificationCheckbox.propTypes = {
  channelId: PropTypes.string.isRequired,
  channelType: PropTypes.number.isRequired,
  onValueChange: PropTypes.func.isRequired,
  defaultSendIndicator: PropTypes.bool,
  disabled: PropTypes.bool,
  errorMessage: PropTypes.string,
  isOptedIn: PropTypes.bool,
  last: PropTypes.bool,
  loadingMessage: PropTypes.string,
  successMessage: PropTypes.string,
};
