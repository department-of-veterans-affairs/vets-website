import React, { useCallback } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isLoggedIn } from 'platform/user/selectors';
import {
  VaButton,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { toggleLoginModal as toggleLoginModalAction } from '@department-of-veterans-affairs/platform-site-wide/actions';

export const App = ({
  shouldDisplayQuickSubmit,
  toggleLoginModal,
  formNumber,
  hasOnlineTool,
}) => {
  // TODO: Confirm this accurately detects if the user is logged in.
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  // const userLoggedIn = true;

  const onSignInClicked = useCallback(() => toggleLoginModal(true), [
    toggleLoginModal,
  ]);

  if (shouldDisplayQuickSubmit === undefined || hasOnlineTool === undefined) {
    return <va-loading-indicator message="Loading..." />;
  }

  if (shouldDisplayQuickSubmit && !hasOnlineTool) {
    return (
      <>
        <h3>Submit completed form</h3>
        <p>
          Once you’ve completed the form you can return here to upload it to us.
        </p>
        {userLoggedIn ? (
          <a
            className="vads-c-action-link--blue"
            href={`/form-upload?form=${formNumber}`}
          >
            Start uploading your form
          </a>
        ) : (
          <VaAlert status="info" data-testid="quick-submit-sign-in-alert" uswds>
            <h2 slot="headline">Sign in now to submit a completed form</h2>
            <p>By signing in you will be able to submit a completed PDF form</p>
            <VaButton
              onClick={onSignInClicked}
              label="ariaLabel"
              // aria-describedby={ariaDescribedby}
              uswds
              text="Sign in to upload your form"
            />
          </VaAlert>
        )}
      </>
    );
  }

  return null;
};

App.propTypes = {
  toggleLoginModal: PropTypes.func.isRequired,
  formNumber: PropTypes.string,
  hasOnlineTool: PropTypes.bool,
  shouldDisplayQuickSubmit: PropTypes.bool,
};

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: open => dispatch(toggleLoginModalAction(open)),
});

const mapStateToProps = _ => ({
  // TODO: Handle this boolean correctly.
  shouldDisplayQuickSubmit: true,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
