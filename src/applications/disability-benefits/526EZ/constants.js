export const E_BENEFITS_URL = 'https://www.ebenefits.va.gov/ebenefits/homepage';

export const itfStatuses = {
  active: 'active',
  expired: 'expired',
  claimRecieved: 'claim_recieved',
  duplicate: 'duplicate',
  incomplete: 'incomplete',
};

export const RESERVE_GUARD_TYPES = {
  nationalGuard: 'National Guard',
  reserve: 'Reserve',
};

export const submissionStatuses = {
  // Statuses returned by the API
  pending: 'submitted', // Submitted to EVSS, waiting response
  retry: 'retrying',
  succeeded: 'received', // Submitted to EVSS, received response
  exhausted: 'exhausted', // EVSS is down or something; ran out of retries
  failed: 'non_retryable_error', // EVSS responded with some error
  // When the api serves a failure
  apiFailure: 'apiFailure',
};

export const terminalStatuses = new Set([
  submissionStatuses.succeeded,
  submissionStatuses.exhausted,
  submissionStatuses.retry,
  submissionStatuses.failed,
]);

export const accountTitleLabels = {
  CHECKING: 'Checking Account',
  SAVINGS: 'Savings Account',
  NOBANK: 'No Bank Account',
};

export const NOBANK = 'NOBANK';

export const PENDING = 'PENDING';
export const RESOLVED = 'RESOLVED';
export const REJECTED = 'REJECTED';
