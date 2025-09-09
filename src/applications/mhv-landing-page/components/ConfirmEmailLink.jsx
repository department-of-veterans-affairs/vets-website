import React from 'react';
import { useSelector } from 'react-redux';
import { isAfter } from 'date-fns';

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

const ConfirmEmailLink = () => {
  const renderConfirmEmailLink = useSelector(showConfirmEmail)();

  if (!renderConfirmEmailLink) {
    return null;
  }

  return (
    <VaCriticalAction
      link="/profile/contact-information#contact-email-address"
      text="Confirm your contact email address to keep getting VA notifications"
      data-testid="va-profile--confirm-contact-email-link"
    />
  );
};

export default ConfirmEmailLink;
