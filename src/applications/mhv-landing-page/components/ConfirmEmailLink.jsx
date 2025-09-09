import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isAfter } from 'date-fns';
/* eslint-disable-next-line import/no-named-default */
import { default as recordEventFn } from '~/platform/monitoring/record-event';

import { VaCriticalAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  isProfileLoading,
  selectVAPContactInfo,
} from '@department-of-veterans-affairs/platform-user/selectors';

export const EMAIL_UPDATED_AT_THRESHOLD = '2025-03-01T12:00:00.000+00:00';

const selectVAPEmailUpdatedAt = state =>
  selectVAPContactInfo(state)?.email?.updatedAt;

/* eslint-disable-next-line prettier/prettier */
export const showConfirmEmail = state => (date = EMAIL_UPDATED_AT_THRESHOLD) => {
  const profileLoading = isProfileLoading(state);
  const emailUpdatedAt = selectVAPEmailUpdatedAt(state);
  const recentlyUpdated = isAfter(new Date(emailUpdatedAt), new Date(date));
  return !profileLoading && !recentlyUpdated;
};

const ConfirmEmailLink = ({ recordEvent = recordEventFn } = {}) => {
  const text =
    'Confirm your contact email address to keep getting VA notifications';
  const renderConfirmEmailLink = useSelector(showConfirmEmail)();

  useEffect(
    () => {
      if (!renderConfirmEmailLink) return;
      recordEvent({
        event: 'nav-alert-box-load',
        action: 'load',
        'alert-box-headline': text,
      });
    },
    [renderConfirmEmailLink, recordEvent],
  );

  if (!renderConfirmEmailLink) {
    return null;
  }

  return (
    <VaCriticalAction
      link="/profile/contact-information#contact-email-address"
      text={text}
      data-testid="va-profile--confirm-contact-email-link"
    />
  );
};

ConfirmEmailLink.propTypes = {
  recordEvent: PropTypes.func,
};

export default ConfirmEmailLink;
