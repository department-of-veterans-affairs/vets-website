import React from 'react';
import { differenceInDays } from 'date-fns';
import {
  formatDateParsedZoneLong,
  timeFromNow,
} from 'platform/utilities/date/index';

export const BANNER_TYPES = {
  PROCESSING: 'PENDING',
  FAILED: 'FAILED',
};

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

export const formSubmissionStatus = x => {
  if (x === BANNER_TYPES.PROCESSING) {
    return (
      <span className="poa-request__card-field--submission-status">
        <va-icon icon="autorenew" size={3} tab-index="-1" aria-hidden="true" />
        We’re processing the accepted POA request
      </span>
    );
  }
  if (x === BANNER_TYPES.FAILED) {
    return (
      <span className="poa-request__card-field--submission-status">
        <va-icon icon="error" size={3} tab-index="-1" aria-hidden="true" />
        We couldn’t process the accepted POA request
      </span>
    );
  }
  return null;
};

export const hideStatus = x => {
  if (x === BANNER_TYPES.PROCESSING || x === BANNER_TYPES.FAILED) {
    return 'vads-u-display--none';
  }
  return null;
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

export const DETAILS_BC_LABEL = 'details breadcrumb';
export const SEARCH_BC_LABEL = 'search breadcrumb';
export const HELP_BC_LABEL = 'search breadcrumb';
export const HelpBC = [
  {
    href: '/representative',
    label: 'VA.gov/representative home',
  },
  {
    href: '/representative/get-help',
    label: 'Get help using the portal',
  },
];

export const poaSearchBC = [
  {
    href: '/representative',
    label: 'VA.gov/representative home',
  },
  {
    href: window.location.href,
    label: 'Power of attorney requests',
  },
];
export const searchPeopleBC = [
  {
    href: '/representative',
    label: '/representative home',
  },
  {
    href: window.location.href,
    label: 'Search People',
  },
];
export const poaDetailsBreadcrumbs = [
  {
    href: '/representative',
    label: 'VA.gov/representative home',
  },
  {
    href:
      '/representative/poa-requests?status=pending&pageSize=20&pageNumber=1',
    label: 'Power of attorney requests',
  },
  {
    href: window.location.href,
    label: 'POA request',
  },
];
export const SEARCH_PARAMS = {
  STATUS: 'status',
  SORTBY: 'sortBy',
  SORTORDER: 'sortOrder',
  SIZE: 'pageSize',
  NUMBER: 'pageNumber',
};
export const SORT_BY = {
  CREATED: 'created_at',
  RESOLVED: 'resolved_at',
  ASC: 'asc',
  DESC: 'desc',
};

export const PENDING = {
  DESC_OPTION: 'Submitted date (newest)',
  ASC_OPTION: 'Submitted date (oldest)',
};

export const PROCESSED = {
  DESC_OPTION: 'Processed date (newest)',
  ASC_OPTION: 'Processed date (oldest)',
};

export const STATUSES = {
  PENDING: 'pending',
  PROCESSED: 'processed',
  // default is 20 per page
  SIZE: '20',
  // default is page 1
  NUMBER: '1',
};
