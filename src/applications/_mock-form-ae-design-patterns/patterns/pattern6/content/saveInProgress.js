// All of these messages are used somewhere within the form save functions, e.g.
// save-in-progress, form controls, downtime notifications & application status
export const customText = {
  appType: 'request',
  appAction: 'your request',
  continueAppButtonText: 'Continue your request',
  startNewAppButtonText: 'Start a new request',
  appSavedSuccessfullyMessage: 'Your request has been saved.',
  finishAppLaterMessage: 'Finish this application later',
  reviewPageTitle: 'Review your request',
  submitButtonText: 'Submit request',
};

export const startText = 'Start the Marital Status form';
export const unauthStartText = 'Sign in to start your request';

export const savedFormMessages = {
  notFound: 'Start over to complete the Marital Status form',
  noAuth: 'Sign in again to continue your Marital Status form',
  // success: '', // always empty?
  // forbidden: '',
};

export const saveInProgress = {
  messages: {
    inProgress:
      "We'll save your application on every change. Your in-progress ID number is 34920.",
    expired:
      'Your saved Marital Status form has expired. If you want to fill out the Marital Status form, start a new request.',
    saved: 'Your Marital Status form has been saved',
  },
  showSaveInProgressMessage: true,
  pageMessageOnly: true,
};
