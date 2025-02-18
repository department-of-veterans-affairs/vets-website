import React from 'react';
import { differenceInDays } from 'date-fns';
import {
  formatDateParsedZoneLong,
  timeFromNow,
} from 'platform/utilities/date/index';

export const expiresSoon = expDate => {
  const EXPIRES_SOON_THRESHOLD_DURATION = 7;
  const now = new Date();
  const expiresAt = new Date(expDate);
  const daysLeft = timeFromNow(expiresAt, now);
  if (
    differenceInDays(expiresAt, now) > 0 &&
    differenceInDays(expiresAt, now) < EXPIRES_SOON_THRESHOLD_DURATION
  ) {
    return `(in ${daysLeft})`;
  }
  return null;
};

export const formatStatus = x => {
  if (x === 'declination') {
    return 'Declined';
  }
  if (x === 'acceptance') {
    return 'Accepted';
  }
  if (x === 'expiration') {
    return 'Expired';
  }
  return 'Pending';
};
export const resolutionDate = (date, requestId) => {
  return (
    <span
      className="poa-request-details__subtitle"
      data-testid={`poa-request-card-${requestId}`}
    >
      {formatDateParsedZoneLong(date)}
    </span>
  );
};
