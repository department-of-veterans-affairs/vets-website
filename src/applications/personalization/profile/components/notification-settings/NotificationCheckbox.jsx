import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import classNames from 'classnames';
import { NotificationStatusMessage } from './NotificationStatusMessage';
import { NOTIFICATION_CHANNEL_FIELD_DESCRIPTIONS } from '../../constants';

export const NotificationCheckbox = ({
  channelId,
  label,
  isOptedIn,
  onValueChange,
  loadingMessage,
  successMessage,
  errorMessage,
  disabled,
  last,
  defaultSendIndicator,
}) => {
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
      >
        <va-icon icon="error" size={3} class="vads-u-margin-right--1" />{' '}
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
      >
        <va-loading-indicator
          label="Loading"
          className="vads-u-margin-right--1"
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
      >
        <va-icon icon="check" size={3} class="vads-u-margin-right--1" />{' '}
        <span className="sr-only">Success</span> {successMessage}
      </NotificationStatusMessage>
    );
  }

  const description = NOTIFICATION_CHANNEL_FIELD_DESCRIPTIONS[channelId];

  const className = classNames({
    'vads-u-padding-bottom--0p5': last,
    'vads-u-display--none': loadingMessage,
  });

  return (
    <div>
      {!loadingMessage && !successMessage && errorSpan}
      {!loadingMessage && !errorMessage && successSpan}
      {!errorMessage && !successMessage && loadingSpan}
      <VaCheckbox
        checked={checked}
        label={label}
        onVaChange={handleChange}
        data-testid={checkboxId}
        id={checkboxId}
        disabled={disabled}
        uswds
        className={className}
        hint={description}
      />{' '}
    </div>
  );
};

NotificationCheckbox.propTypes = {
  channelId: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onValueChange: PropTypes.func.isRequired,
  defaultSendIndicator: PropTypes.bool,
  disabled: PropTypes.bool,
  errorMessage: PropTypes.string,
  isOptedIn: PropTypes.bool,
  last: PropTypes.bool,
  loadingMessage: PropTypes.string,
  successMessage: PropTypes.string,
};
