// libs
import React from 'react';
import PropTypes from 'prop-types';

// actions
import {
  autoSaveForm,
  saveAndRedirectToReturnUrl,
  saveErrors,
} from './actions';

import CallHRC from 'platform/static-data/CallHRC';

// utilities
import environment from 'platform/utilities/environment';
import {
  FINISH_APP_LATER_DEFAULT_MESSAGE,
  APP_TYPE_DEFAULT,
} from 'platform/forms-system/src/js/constants';

function InlineErrorComponent() {
  let InlineErrorComponent;
  if (typeof errorText === 'function') {
    InlineErrorComponent = errorText;
  } else if (typeof errorText === 'string') {
    InlineErrorComponent = () => <p>{errorText}</p>;
  } else {
    InlineErrorComponent = () => (
      <p>
        If it still doesn’t work, please <CallHRC />
      </p>
    );
  }

  return InlineErrorComponent;
}

function SavedInProgressSubmitMessage(props) {
  const {
    form,
    formConfig,
    location,
    route,
    saveAndRedirectToReturnUrl,
    toggleLoginModal,
    user,
  } = props;
  const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;

  if (saveErrors.has(savedStatus)) {
    return (
      <SaveFormLink
        locationPathname={location.pathname}
        form={form}
        formConfig={route?.formConfig}
        pageList={route.pageList}
        user={user}
        showLoginModal={showLoginModal}
        saveAndRedirectToReturnUrl={saveAndRedirectToReturnUrl}
        toggleLoginModal={toggleLoginModal}
      >
        Save your {appType}
      </SaveFormLink>
    );
  }
  else {
    return (
      <div className="usa-alert usa-alert-error schemaform-failure-alert">
        <div className="usa-alert-body">
          <p className="schemaform-warning-header">
            <strong>
              We’re sorry. We can't submit your {appType} right now.
            </strong>
          </p>
          <p>
            We’re working to fix the problem. Please make sure you’re
            connected to the Internet, and then try saving your {appType}{' '}
            again. {saveLink}.
          </p>
          {!user.login.currentlyLoggedIn && (
            <p>
              If you don’t have an account, you’ll have to start over. Try
              submitting your {appType} again tomorrow.
            </p>
          )}
          <InlineErrorComponent />
        </div>
      </div>
    );
  }
}

function SavedInProgressErrorMessage(props) {
  const { formConfig, onSubmit } = props;

  return (
    <>
      <Row>
        <Column classNames="small-12 medium-12" role="alert">
          <SavedInProgressSubmitMessage />
        </Column>
      </Row>
      <PreSubmitSection formConfig={formConfig} />
      <Row classNames="form-progress-buttons schemaform-back-buttons">
        <Column classNames="small-6 usa-width-one-half medium-6">
          <a href="/">
            <button className="usa-button-primary">Go Back to VA.gov</button>
          </a>
        </Column>
        {
          !environment.isProduction() && (
            <Column classNames="small-6 usa-width-one-half medium-6">
              <a onClick={onSubmit}>Submit again</a>
            </Column>
          )
        }
      </Row>
    </>
  );
}

export default SavedInProgressErrorMessage;
