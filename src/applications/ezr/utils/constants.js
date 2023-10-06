// declare address overrides for uiSchema and schema declarations
export const DEFAULT_ADDRESS_OVERRIDES = {
  uiSchema: {
    street: {
      'ui:title': 'Street address',
      'ui:errorMessages': {
        pattern: 'Please provide a valid street address.',
      },
    },
    city: {
      'ui:errorMessages': {
        pattern: 'Please provide a valid city.',
      },
    },
    state: {
      'ui:title': 'State/Province/Region',
      'ui:errorMessages': {
        required: 'Please enter a state/province/region',
      },
    },
  },
  schema: {
    properties: {
      street: {
        minLength: 1,
        maxLength: 30,
      },
      street2: {
        minLength: 1,
        maxLength: 30,
      },
      street3: {
        type: 'string',
        minLength: 1,
        maxLength: 30,
      },
      city: {
        minLength: 1,
        maxLength: 30,
      },
    },
  },
};

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

// declare default SIGI values
export const SIGI_GENDERS = {
  NB: 'Non-binary',
  M: 'Man',
  F: 'Woman',
  TM: 'Transgender man',
  TF: 'Transgender woman',
  O: 'A gender not listed here',
  NA: 'Prefer not to answer',
};
