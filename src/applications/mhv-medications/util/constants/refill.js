export const MEDICATION_REFILL_CONFIG = {
  ERROR: {
    id: 'error-refill',
    testId: 'error-refill',
    status: 'error',
    className: 'vads-u-margin-y--1',
    title: 'Request not submitted',
    description: `We’re sorry. There’s a problem with our system.`,
    suggestion: `Try requesting your refills again. If it still doesn’t work, contact your VA pharmacy.`,
  },
  PARTIAL: {
    id: 'partial-refill',
    testId: 'partial-refill',
    status: 'error',
    className: 'vads-u-margin-y--2',
    title: 'Only part of your request was submitted',
    description: `We’re sorry. There’s a problem with our system. We couldn’t submit these refill requests:`,
    suggestion: `Try requesting these refills again. If it still doesn’t work, call your VA pharmacy.`,
  },
  SUCCESS: {
    id: 'success-refill',
    testId: 'success-refill',
    status: 'success',
    className: 'vads-u-margin-y--2',
    title: 'Refills requested',
    description:
      'To check the status of your refill requests, go to your medications list and filter by "recently requested."',
    linkText: 'Go to your medications list',
  },
};

export const REFILL_STATUS = {
  FINISHED: 'finished',
  NOT_STARTED: 'notStarted',
  IN_PROGRESS: 'inProgress',
  ERROR: 'error',
};

export const REFILL_LOADING_MESSAGES = {
  SUBMITTING_REFILL_REQUESTS: 'Submitting refill requests...',
  LOADING_PRESCRIPTIONS: 'Loading prescriptions...',
  LOADING: 'Loading...',
  UPDATING_REFILL_LIST: 'Updating your refillable prescriptions list...',
};

export const REFILL_ERROR_MESSAGES = {
  BULK_REFILL_FAILED: 'Failed to submit refill request',
  NO_PRESCRIPTIONS_SELECTED: 'Select at least one prescription to refill',
};

export const RX_SOURCE = {
  PARTIAL_FILL: 'PF',
  VA: 'VA',
  NON_VA: 'NV',
  PENDING_DISPENSE: 'PD',
};
