import { REDIRECTED_PART3 } from '../constants';

/**
 * Redirecting Veterans to request extension page. If return URL is:
 * - on or past the contestable issues page, redirect to request extension page
 * - on or before the filing deadlines page, do not redirect
 */
export default function redirectToV2Questions(savedData) {
  const { formData, metadata } = savedData;

  // Get from config/form page paths
  const pagesBefore = [
    '/veteran-details',
    '/homeless',
    '/contact-information', // don't need to include edit pages
    '/filing-deadlines',
  ];

  if (pagesBefore.includes(metadata.returnUrl)) {
    return savedData;
  }

  return {
    formData,
    metadata: {
      ...metadata,
      // add to metadata because we only want this flag to be temporary
      [REDIRECTED_PART3]: true,
      returnUrl: '/extension-request',
    },
  };
}
