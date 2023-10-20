/**
 * Redirecting Veterans to request extension page. If return URL is:
 * - on or past the contestable issues page, redirect to request extension page
 * - on or before the filing deadlines page, do not redirect
 */
export default function checkRedirect(returnUrl) {
  // Get from config/form page paths
  const pagesBefore = [
    '/veteran-details',
    '/homeless',
    '/contact-information', // don't need to include edit pages
    '/filing-deadlines',
  ];

  return !pagesBefore.includes(returnUrl);
}
