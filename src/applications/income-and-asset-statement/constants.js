import environment from '@department-of-veterans-affairs/platform-utilities/environment';

const MAX_FILE_SIZE_MB = 20;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 ** 2;
export const FILE_UPLOAD_URL = `${environment.API_URL}/v0/claim_attachments`;
export const FORM_NUMBER = '21P-0969';

export const REGEXP = {
  NON_DIGIT: /\D/g,
};
