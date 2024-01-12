import {
  getNextPagePath,
  checkValidPagePath,
} from 'platform/forms-system/src/js/routing';

import { SHOW_PART3, SHOW_PART3_REDIRECT } from '../constants';

/**
 * Redirecting Veterans to request extension page. If return URL is:
 * - on or past the contestable issues page, redirect to request extension page
 * - on or before the filing deadlines page, do not redirect
 * @param {String} returnUrl - path to page within form
 */
export function checkRedirect(returnUrl) {
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

/**
 * Redirect to new part 3 questions if feature toggle is set
 * @param {Object} formData - full form data
 * @param {String} returnUrl - return URL from last save-in-progress save
 * @param {Object} route - React router routes object
 * @param {Object} router - React router objects
 */
export const onFormLoaded = props => {
  const { formData, isStartingOver } = props;
  let { returnUrl } = props;

  if (
    formData[SHOW_PART3] &&
    formData[SHOW_PART3_REDIRECT] === 'redirected' &&
    !isStartingOver
  ) {
    returnUrl = '/extension-request';
  }

  // Check valid return URL; copied from RoutedSavableApp
  const isValidReturnUrl = checkValidPagePath(
    props.routes[props.routes.length - 1].pageList,
    formData,
    returnUrl,
  );

  if (isValidReturnUrl) {
    props.router.push(returnUrl);
  } else {
    const nextPagePath = getNextPagePath(
      props.routes[props.routes.length - 1].pageList,
      formData,
      '/introduction',
    );
    props.router.push(nextPagePath);
  }
};
