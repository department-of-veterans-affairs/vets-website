import { isAfter } from 'date-fns';
import {
  isProfileLoading,
  selectVAPEmailUpdatedAt,
} from '@department-of-veterans-affairs/platform-user/selectors';

export const EMAIL_UPDATED_AT_THRESHOLD = '2025-03-01T12:00:00.000+00:00';

/* eslint-disable-next-line prettier/prettier */
export const showConfirmEmail = state => (date = EMAIL_UPDATED_AT_THRESHOLD) => {
  const profileLoading = isProfileLoading(state);
  const emailUpdatedAt = selectVAPEmailUpdatedAt(state);
  const recentlyUpdated = isAfter(new Date(emailUpdatedAt), new Date(date));
  return !profileLoading && !recentlyUpdated;
};
