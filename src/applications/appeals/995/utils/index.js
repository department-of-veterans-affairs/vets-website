import { EVIDENCE_URLS } from '../constants';

// ------- REMOVE when new design toggle is removed
export const redesignActive = formData => {
  return formData?.scRedesign;
};
// ------- END REMOVE

/**
 * Redirect to the user's last saved URL if it exists
 * @param {String} returnUrl - URL of last saved page
 * @param {Object} router - React router
 */
// ------- RESTORE when new design toggle is removed
// export const onFormLoaded = () => {
// const { returnUrl, router } = props;

// if (returnUrl) {
//   router?.push(returnUrl);
// }
// };
// ------- END RESTORE

// ------- REMOVE when new design toggle is removed
export const onFormLoaded = ({ formData, returnUrl, router }) => {
  const pagesOutsideRedesign = [
    '/veteran-information',
    '/housing-risk',
    '/living-situation',
    '/other-housing-risks',
    '/point-of-contact',
    '/contact-information',
    '/primary-phone-number',
    '/contestable-issues',
    '/issue-summary',
    '/opt-in',
    '/notice-of-evidence-needed',
    '/facility-types',
    '/review-and-submit',
  ];

  // In this scenario, the user is returning to the form somewhere in the middle
  // of the pages being redesigned. We need to push them to the beginning of the
  // new pages so they can ensure their data is properly filled out in the new flow
  //
  // --> TODO: add further logic to ensure that users who have already started the
  // new flow in a previous session aren't redirected again
  //
  // if (redesignActive(formData) && some new flow formData exists) {
  //
  // }

  if (redesignActive(formData) && !pagesOutsideRedesign.includes(returnUrl)) {
    router?.push(EVIDENCE_URLS.vaPrompt);
  }

  // --> TODO: In the event that someone has started the new flow, then saves their app and
  // returns later but the feature_toggles call fails, they will need to start at
  // the beginning of the evidence flow in order to make sure the form is filled out
  // properly. Not an ideal scenario, but we should try to plan for it.
  //
  // if (!redesignActive(formData) && some new flow formData exists) {
  // router?.push(EVIDENCE_VA_PROMPT_URL);
  // }

  if (returnUrl) {
    router?.push(returnUrl);
  }
};
// ------- END REMOVE
