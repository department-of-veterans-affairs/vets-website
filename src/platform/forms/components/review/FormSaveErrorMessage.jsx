// libs
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

// platform - forms - actions
import {
  saveErrors,
  saveAndRedirectToReturnUrl as saveAndRedirectToReturnUrlAction,
} from 'platform/forms/save-in-progress/actions';
import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';

import { APP_TYPE_DEFAULT } from 'platform/forms-system/src/js/constants';

// platform - forms components
import ErrorMessage from 'platform/forms/components/common/alerts/ErrorMessage';

// platform - forms containers
import SaveFormLink from 'platform/forms/save-in-progress/SaveFormLink';

// platform
import CallHRC from 'platform/static-data/CallHRC';

// platform - forms - selectors
import {
  formSelector,
  showLoginModalSelector,
  userSelector,
} from 'platform/forms/selectors/review';
import { isReactComponent } from 'platform/utilities/ui';

function FormSaveErrorMessage(props) {
  const { route, formConfig, user, form, location, showLoginModal } = props;

  const savedStatus = form?.savedStatus;
  const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;
  const CustomSubmissionError = formConfig?.submissionError;
  const errorText = formConfig?.errorText;

  const saveLink = (
    <SaveFormLink
      locationPathname={location?.pathname}
      form={form}
      formConfig={route?.formConfig}
      user={user}
      showLoginModal={showLoginModal}
      saveAndRedirectToReturnUrl={props.saveAndRedirectToReturnUrl}
      toggleLoginModal={props.toggleLoginModal}
    >
      Save your {appType}
    </SaveFormLink>
  );

  if (saveErrors.has(savedStatus)) {
    return saveLink;
  }

  const DefaultErrorMessage = () => {
    let InlineErrorComponent;
    if (isReactComponent(errorText)) {
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

    return (
      <ErrorMessage
        active
        title={`We’re sorry. We can’t submit your ${appType} right now.`}
      >
        <p>
          We’re working to fix the problem. Please make sure you’re connected to
          the Internet, and then try saving your {appType} again.
        </p>
        {user.login.currentlyLoggedIn ? (
          <>{saveLink}.</>
        ) : (
          <p>
            If you don’t have an account, you’ll have to start over. Try
            submitting your {appType} again tomorrow.
          </p>
        )}
        <InlineErrorComponent />
      </ErrorMessage>
    );
  };

  return CustomSubmissionError ? (
    <CustomSubmissionError
      location={location}
      form={form}
      user={user}
      saveLink={saveLink}
    />
  ) : (
    <DefaultErrorMessage />
  );
}

const mapDispatchToProps = {
  saveAndRedirectToReturnUrl: saveAndRedirectToReturnUrlAction,
  toggleLoginModal: toggleLoginModalAction,
};

export default withRouter(
  connect(
    state => {
      const form = formSelector(state);
      const showLoginModal = showLoginModalSelector(state);
      const user = userSelector(state);

      return {
        form,
        showLoginModal,
        user,
      };
    },
    mapDispatchToProps,
  )(FormSaveErrorMessage),
);

FormSaveErrorMessage.propTypes = {
  form: PropTypes.object,
  formConfig: PropTypes.object,
  location: PropTypes.object,
  route: PropTypes.object,
  saveAndRedirectToReturnUrl: PropTypes.func,
  showLoginModal: PropTypes.bool,
  toggleLoginModal: PropTypes.func,
  user: PropTypes.object,
};
