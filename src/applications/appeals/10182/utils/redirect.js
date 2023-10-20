/**
 * Redirecting Veterans to request extension page. If return URL is:
 * - on or past the contestable issues page, redirect to request extension page
 * - on or before the filing deadlines page, do not redirect
 */
export default function doesVeteranNeedToBeRedirectedToNewQuestions(returnUrl) {
  // We're using a hardcoded list of pages, as opposed to importing them from formConfig because: 1) this is temporary
  // code that we plan to rip out after successful NOD part 3 launch, and 2) importing them from formConfig creates a
  // cyclical dependency problem that's not worth the time to resolve right now.
  const pagesBeforeTheNewNODPart3Questions = [
    // This list starts at the veteran-details page, as opposed to earlier pages like the introduction page,
    // because the veteran-details page is the first page to get stored in the SIP form (i.e. as the `returnUrl`).
    '/veteran-details',
    '/homeless',
    '/contact-information', // don't need to include edit pages, because they don't have a SIP link.
    '/filing-deadlines',
  ];

  return !pagesBeforeTheNewNODPart3Questions.includes(returnUrl);
}
