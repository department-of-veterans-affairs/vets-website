// declare prefix for use in GA events related to disability rating
export const DISABILITY_PREFIX = 'disability-ratings';

// declare action statuses for fetching disability rating
export const DISABILITY_RATING_ACTIONS = {
  FETCH_DISABILITY_RATING_STARTED: 'FETCH_DISABILITY_RATING_STARTED',
  FETCH_DISABILITY_RATING_SUCCEEDED: 'FETCH_DISABILITY_RATING_SUCCEEDED',
  FETCH_DISABILITY_RATING_FAILED: 'FETCH_DISABILITY_RATING_FAILED',
};

// declare initial state for disability rating reducer
export const DISABILITY_RATING_INIT_STATE = {
  totalDisabilityRating: null,
  loading: true,
  error: null,
};

// declare action statuses for fetching enrollment status
export const ENROLLMENT_STATUS_ACTIONS = {
  FETCH_ENROLLMENT_STATUS_STARTED: 'FETCH_ENROLLMENT_STATUS_STARTED',
  FETCH_ENROLLMENT_STATUS_SUCCEEDED: 'FETCH_ENROLLMENT_STATUS_SUCCEEDED',
  FETCH_ENROLLMENT_STATUS_FAILED: 'FETCH_ENROLLMENT_STATUS_FAILED',
};

// declare initial state for entrollment status reducer
export const ENROLLMENT_STATUS_INIT_STATE = {
  hasServerError: false,
  parsedStatus: null,
  loading: false,
};

// declare the minimum percentage value to be considered high disability
export const HIGH_DISABILITY_MINIMUM = 50;
