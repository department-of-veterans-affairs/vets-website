import manifest from '../manifest.json';

export const BASE_URL = `${manifest.rootUrl}/`;
export const REVIEW_ENROLLMENTS_URL_SEGMENT =
  'post-911-gi-bill-enrollment-verifications';
export const REVIEW_ENROLLMENTS_URL = `${BASE_URL}${REVIEW_ENROLLMENTS_URL_SEGMENT}/`;
export const REVIEW_ENROLLMENTS_RELATIVE_URL = `/${REVIEW_ENROLLMENTS_URL_SEGMENT}/`;

export const VERIFY_ENROLLMENTS_URL_SEGMENT = 'verify-all-enrollments';
export const VERIFY_ENROLLMENTS_URL = `${REVIEW_ENROLLMENTS_URL}${VERIFY_ENROLLMENTS_URL_SEGMENT}/`;
export const VERIFY_ENROLLMENTS_RELATIVE_URL = `/${REVIEW_ENROLLMENTS_URL_SEGMENT}/${VERIFY_ENROLLMENTS_URL_SEGMENT}/`;
