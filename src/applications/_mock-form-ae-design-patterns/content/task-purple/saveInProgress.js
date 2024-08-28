// All of these messages are used somewhere within the form save functions, e.g.
// save-in-progress, form controls, downtime notifications & application status
export const customText = {
  appType: 'request',
  appAction: 'your request',
  continueAppButtonText: 'Continue your request',
  startNewAppButtonText: 'Start a new request',
  appSavedSuccessfullyMessage: 'Your request has been saved.',
  finishAppLaterMessage: 'Finish this request later',
  reviewPageTitle: 'Review your request',
  submitButtonText: 'Submit request',
};

export const startText = 'Start the Board Appeal request';
export const unauthStartText = 'Sign in to start your request';

export const savedFormMessages = {
  notFound: 'Start over to apply for a board appeal',
  noAuth: 'Sign in again to continue your request for a board appeal',
  // success: '', // always empty?
  // forbidden: '',
};

export const saveInProgress = {
  messages: {
    inProgress: 'Your Board Appeal request is in progress',
    expired:
      'Your saved Board Appeal request has expired. If you want to request a Board Appeal, start a new request.',
    saved: 'Your Board Appeal request has been saved',
  },
};
