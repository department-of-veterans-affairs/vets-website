// libs
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// platform - forms - actions
import { saveAndRedirectToReturnUrl as saveAndRedirectToReturnUrlAction } from 'platform/forms/save-in-progress/actions';
import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';

// platform - forms components
import Column from 'platform/forms/components/common/grid/Column';
import ErrorMessage from 'platform/forms/components/common/alerts/ErrorMessage';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';
import Row from 'platform/forms/components/common/grid/Row';

// platform - forms containers
import PreSubmitSection from 'platform/forms/containers/review/PreSubmitSection';
import SaveFormLink from 'platform/forms/save-in-progress/SaveFormLink';

// platform
import CallHRC from 'platform/static-data/CallHRC';

// platform - forms - selectors
import {
  formSelector,
  showLoginModalSelector,
  userSelector,
} from 'platform/forms/selectors/review';

// TODO: evaluate extract as common component?
function DefaultError() {
  return (
    <p>
      If it still doesn’t work, please <CallHRC />
    </p>
  );
}

// TODO: evaluate extract as common component?
function InlineErrorComponent(props) {
  const { errorText } = props;

  return (
    (typeof errorText === 'function' && errorText) || (
      <p>{errorText || <DefaultError />}</p>
    )
  );
}

function GenericError(props) {
  const {
    form,
    formConfig,
    goBack,
    hasSaveError,
    location,
    onSubmit,
    saveAndRedirectToReturnUrl,
    showLoginModal,
    toggleLoginModal,
    user,
  } = props;

  const { errorText } = formConfig;
  const isLoggedIn = user?.login?.currentlyLoggedIn;
  let submitButton;

  const saveLink = (
    <SaveFormLink
      locationPathname={location.pathname}
      form={form}
      user={user}
      showLoginModal={showLoginModal}
      saveAndRedirectToReturnUrl={saveAndRedirectToReturnUrl}
      toggleLoginModal={toggleLoginModal}
    >
      Save your form
    </SaveFormLink>
  );

  if (process.env.NODE_ENV !== 'production') {
    submitButton = (
      <Column className="small-6 usa-width-one-half medium-6">
        <a onClick={onSubmit}>Submit again</a>
      </Column>
    );
  }

  if (hasSaveError) {
    return saveLink;
  }
  else {
    return (
      <>
        <Row>
          <Column>
            <ErrorMessage
              active
              title="We’re sorry. We can't submit your form right now."
            >
              <p>
                We’re working to fix the problem. Please make sure you’re connected
                to the Internet, and then try saving your form again. {saveLink}.
              </p>
              {!isLoggedIn && (
                <p>
                  If you don’t have an account, you’ll have to start over. Try
                  submitting your form again tomorrow.
                </p>
              )}
            </ErrorMessage>
            <InlineErrorComponent errorText={errorText} />
          </Column>
        </Row>
        <PreSubmitSection formConfig={formConfig} />
        <Row classNames="form-progress-buttons">
          <Column classNames="small-6 medium-5">
            <ProgressButton
              onButtonClick={goBack}
              buttonText="Back"
              buttonClass="usa-button-secondary"
              beforeText="«"
            />
          </Column>
          <Column classNames="small-6 medium-5">
            {submitButton}
          </Column>
          <Column classNames="small-1 medium-1 end">
            <div className="hidden">&nbsp;</div>
          </Column>
        </Row>
      </>
    );
  }
}

const mapDispatchToProps = {
  saveAndRedirectToReturnUrl: saveAndRedirectToReturnUrlAction,
  toggleLoginModal: toggleLoginModalAction,
};

export default withRouter(
  connect(
    (state, ownProps) => {
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
  )(GenericError),
);
