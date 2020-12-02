import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import SignInLink from '../components/SignInLink';
import { SAVE_STATUSES, saveErrors } from './actions';
import {
  APP_SAVED_SUCCESSFULLY_DEFAULT_MESSAGE,
  APP_TYPE_DEFAULT,
} from '../../forms-system/src/js/constants';

function SaveStatus({
  form: { lastSavedDate, autoSavedStatus, loadedData },
  formConfig,
  isLoggedIn,
  showLoginModal,
  toggleLoginModal,
}) {
  let savedAtMessage;
  if (lastSavedDate) {
    const savedAt = moment(lastSavedDate);
    savedAtMessage = ` It was last saved on ${savedAt.format(
      'MMM D, YYYY [at] h:mm a',
    )}`;
  } else {
    savedAtMessage = '';
  }

  const formId = loadedData?.metadata?.inProgressFormId;
  const formIdMessage =
    formId && savedAtMessage ? (
      <>
        {' '}
        Your application ID number is <strong>{formId}</strong>.
      </>
    ) : null;

  const hasError =
    saveErrors.has(autoSavedStatus) &&
    ((autoSavedStatus === SAVE_STATUSES.noAuth && !isLoggedIn) ||
      autoSavedStatus !== SAVE_STATUSES.noAuth);

  const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;
  const appSavedSuccessfullyMessage =
    formConfig?.customText?.appSavedSuccessfullyMessage ||
    APP_SAVED_SUCCESSFULLY_DEFAULT_MESSAGE;

  return (
    <div>
      {autoSavedStatus === SAVE_STATUSES.success && (
        <div className="panel saved-success-container vads-u-display--flex">
          <i className="fa fa-check-circle saved-success-icon vads-u-margin-top--0p5" />
          <div>
            {appSavedSuccessfullyMessage}
            {savedAtMessage}
            {formIdMessage}
          </div>
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
            `We’re sorry. We’re unable to connect to VA.gov. Please check that you’re connected to the Internet, so we can save your ${appType} in progress.`}
          {autoSavedStatus === SAVE_STATUSES.failure &&
            `We’re sorry, but we’re having some issues and are working to fix them. You can continue filling out the ${appType}, but it will not be automatically saved as you fill it out.`}
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
                  Sign in to save your {appType} in progress
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
    customText: PropTypes.shape({
      appSavedSuccessfullyMessage: PropTypes.string,
    }),
  }),
};

export default SaveStatus;
