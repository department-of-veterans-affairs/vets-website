//
// See https://github.com/department-of-veterans-affairs/vets-api/blob/41b7196ae639680f96589286b612821de0bc0274/app/sidekiq/lighthouse/create_intent_to_file_job.rb#L18-L22
export const ITF_SUPPORTED_BENEFIT_TYPES = [
  'compensation', // 21-526EZ, 21-0995
  'pension', // 21P-527EZ
  'survivor', // 21P-534EZ
];

export const ITF_STATUSES = {
  active: 'active',
  expired: 'expired',
  claimRecieved: 'claim_recieved', // intentional typo to match API
  duplicate: 'duplicate',
  incomplete: 'incomplete',
  canceled: 'canceled',
};

export const ITF_API = '/v0/intent_to_file';

export const ITF_FETCH_SUCCEEDED = 'ITF_FETCH_SUCCEEDED';
export const ITF_FETCH_FAILED = 'ITF_FETCH_FAILED';

export const ITF_CREATION_SUCCEEDED = 'ITF_CREATION_SUCCEEDED';
export const ITF_CREATION_FAILED = 'ITF_CREATION_FAILED';

// Include year when using the formatDowntime function
export const DAY_YEAR_PATTERN = 'd, y';
