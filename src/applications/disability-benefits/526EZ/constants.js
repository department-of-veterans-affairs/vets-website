export const VA_FORM4142_URL =
  'https://www.vba.va.gov/pubs/forms/VBA-21-4142-ARE.pdf';
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
