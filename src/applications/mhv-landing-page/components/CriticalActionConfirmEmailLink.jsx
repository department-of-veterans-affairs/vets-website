import React from 'react';
import { useSelector } from 'react-redux';
import { isAfter } from 'date-fns';
import { VaCriticalAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  isProfileLoading,
  selectVAPEmailUpdatedAt,
} from '@department-of-veterans-affairs/platform-user/selectors';

export const DATE_THRESHOLD = '2025-03-01T12:00:00.000+00:00';

const CriticalActionConfirmEmailLink = () => {
  const profileLoading = useSelector(isProfileLoading);
  const emailUpdatedAt = useSelector(selectVAPEmailUpdatedAt);
  const recentlyUpdated = isAfter(
    new Date(emailUpdatedAt),
    new Date(DATE_THRESHOLD),
  );

  if (profileLoading || recentlyUpdated) {
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

export default CriticalActionConfirmEmailLink;
