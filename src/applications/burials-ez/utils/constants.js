import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';

const MAX_FILE_SIZE_MB = 20;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 ** 2;
export const FILE_UPLOAD_URL = `${environment.API_URL}/v0/claim_attachments`;
export const FORM_NUMBER = VA_FORM_IDS.FORM_21P_530EZ;
