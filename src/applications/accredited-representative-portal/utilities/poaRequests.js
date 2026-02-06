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

export const PROCESSING_BANNER = {
  HEADER: 'We’re processing the accepted request',
  ACCEPTED: 'accepted the request on',
  COPY:
    'Processing an accepted request normally takes 1-2 minutes, but can sometimes take longer. Representation won’t be established until the request finishes processing. You can refresh the page to check for status updates.',
};

export const ERROR_BANNER = {
  HEADER: 'We couldn’t process the accepted request',
  COPY:
    'We’re sorry, there was a problem with our system. We weren’t able to process the accepted request. Representation has not been established with this claimant. To try again, ask the claimant to resubmit online VA Form 21-22.',
};

export const expiresSoon = expDate => {
  const now = new Date();
  const expiresAt = new Date(expDate);
  const daysLeft = timeFromNow(expiresAt, now);
  if (differenceInDays(expiresAt, now) > 0) {
    return `(expires in ${daysLeft})`;
  }
  return null;
};

export const expiresSoonIcon = expDate => {
  const EXPIRES_SOON_THRESHOLD_DURATION = 7;
  const now = new Date();
  const expiresAt = new Date(expDate);
  if (
    differenceInDays(expiresAt, now) > 0 &&
    differenceInDays(expiresAt, now) < EXPIRES_SOON_THRESHOLD_DURATION
  ) {
    return true;
  }
  return null;
};

export const requestsContainStatus = (status, requests) => {
  if (status === 'pending') {
    return requests.find(poaRequest => poaRequest.resolution === null);
  }
  return requests.find(
    poaRequest =>
      (poaRequest.resolution?.decisionType || poaRequest.resolution?.type) ===
      status,
  );
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
        We’re processing the accepted request
      </span>
    );
  }
  if (x === BANNER_TYPES.FAILED) {
    return (
      <span className="poa-request__card-field--submission-status">
        <va-icon icon="error" size={3} tab-index="-1" aria-hidden="true" />
        We couldn’t process the accepted request
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
export const HELP_BC_LABEL = 'help breadcrumb';
export const DASHBOARD_BC_LABEL = 'dashboard breadcrumb';

export const HelpBC = [
  {
    href: '/representative',
    label: 'VA.gov/representative home',
  },
  {
    href: '/representative/help',
    label: 'Get help with the Accredited Representative Portal',
  },
];

export const poaSearchBC = [
  {
    href: '/representative',
    label: 'VA.gov/representative home',
  },
  {
    href: window.location.href,
    label: 'Representation requests',
  },
];
export const findClaimantBC = [
  {
    href: '/representative',
    label: 'VA.gov/representative home',
  },
  {
    href: window.location.href,
    label: 'Find claimant',
  },
];
export const poaDetailsBreadcrumbs = [
  {
    href: '/representative',
    label: 'VA.gov/representative home',
  },
  {
    href: '/representative/representation-requests',
    label: 'Representation requests',
  },
  {
    href: window.location.href,
    label: 'Representation request',
  },
];

export const dashboardBC = [
  {
    href: '/representative',
    label: 'VA.gov/representative home',
  },
  {
    href: window.location.href,
    label: 'Dashboard',
  },
];

export const checkReason = poaRequest => {
  const declinationReason = poaRequest?.resolution?.declinationReason;
  switch (declinationReason) {
    case 'LIMITED_AUTH':
      return 'because authorization is limited.';
    case 'OUTSIDE_SERVICE_TERRITORY':
      return 'because the claimant is outside of the organization’s service territory.';
    default:
      return 'because of another reason.';
  }
};
