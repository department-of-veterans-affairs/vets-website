import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import SignInLink from '../components/SignInLink';
import { saveErrors, SAVE_STATUSES } from './actions';
import { APP_SAVED_SUCCESSFULLY_DEFAULT_MESSAGE } from './constants';

function SaveStatus({
  form: { lastSavedDate, autoSavedStatus },
  formConfig,
  isLoggedIn,
  showLoginModal,
  toggleLoginModal,
}) {
  let savedAtMessage;
  if (lastSavedDate) {
    const savedAt = moment(lastSavedDate);
    savedAtMessage = ` Last saved at ${savedAt.format(
      'MMM D, YYYY [at] h:mm a',
    )}`;
  } else {
    savedAtMessage = '';
  }

  const hasError =
    saveErrors.has(autoSavedStatus) &&
    ((autoSavedStatus === SAVE_STATUSES.noAuth && !isLoggedIn) ||
      autoSavedStatus !== SAVE_STATUSES.noAuth);

  return (
    <div>
      {autoSavedStatus === SAVE_STATUSES.success && (
        <div className="panel saved-success-container">
          <i className="fa fa-check-circle saved-success-icon" />
          {formConfig.savedFormMessages.appSavedSuccessfullyMessage ||
            APP_SAVED_SUCCESSFULLY_DEFAULT_MESSAGE}
          {savedAtMessage}
        </div>
      )}
      {autoSavedStatus === SAVE_STATUSES.pending && (
        <p className="saved-form-autosaving">Saving...</p>
      )}
      {hasError && (
        <div
          role="alert"
          className="usa-alert usa-alert-error background-color-only schemaform-save-error"
        >
          {autoSavedStatus === SAVE_STATUSES.clientFailure &&
            `We’re sorry. We’re unable to connect to VA.gov. Please check that you’re connected to the Internet, so we can save your form in progress.`}
          {autoSavedStatus === SAVE_STATUSES.failure &&
            'We’re sorry, but we’re having some issues and are working to fix them. You can continue filling out the form, but it will not be automatically saved as you fill it out.'}
          {!isLoggedIn &&
            autoSavedStatus === SAVE_STATUSES.noAuth && (
              <span>
                Sorry, you’re no longer signed in.{' '}
                <SignInLink
                  className="va-button-link"
                  isLoggedIn={isLoggedIn}
                  showLoginModal={showLoginModal}
                  toggleLoginModal={toggleLoginModal}
                >
                  Sign in to save your form in progress
                </SignInLink>
                .
              </span>
            )}
        </div>
      )}
    </div>
  );
}

SaveStatus.propTypes = {
  form: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  formConfig: PropTypes.shape({
    savedFormMessages: PropTypes.shape({
      appSavedSuccessfullyMessage: PropTypes.string,
    }),
  }).isRequired,
};

export default SaveStatus;
