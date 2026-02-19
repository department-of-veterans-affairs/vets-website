import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { envApiUrl } from '../constants';

const baseURL = '/ask_va_api/v0';

export const ENDPOINTS = {
  inquiries: `${envApiUrl}${baseURL}/inquiries`,
  inquiriesAuth: `${envApiUrl}${baseURL}/inquiries/auth`,
};

export async function getAllInquiries() {
  return apiRequest(ENDPOINTS.inquiries);
}

/** @param {string} inquiryId Also known as "reference number" or "inquiry number" */
export async function getInquiry(inquiryId) {
  return apiRequest(`${ENDPOINTS.inquiries}/${inquiryId}`);
}
