import {
  VaAlertSignIn,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import ProgressButton from '~/platform/forms-system/src/js/components/ProgressButton';
import manifest from '../manifest.json';

const SignInInterruptPage = ({ goBack, goForward }) => {
  const isLoggedIn = useSelector(state => state.user.login.currentlyLoggedIn);

  useEffect(
    () => {
      if (isLoggedIn) {
        goForward();
      }
    },
    [isLoggedIn, goForward],
  );

  const navigateToAskVAAndTriggerLoginModal = () => {
    window.location.href = `${
      manifest.rootUrl
    }/introduction?showSignInModal=true`;
  };

  return (
    <>
      <form className="rjsf">
        <VaAlertSignIn variant="signInRequired" visible headingLevel={4}>
          <span slot="SignInButton">
            <VaButton
              text="Sign in or create an account"
              onClick={navigateToAskVAAndTriggerLoginModal}
            />
          </span>
        </VaAlertSignIn>

        <div className="row form-progress-buttons schemaform-buttons vads-u-margin-y--2">
          <div className="small-6 medium-5 columns">
            {goBack && (
              <ProgressButton
                onButtonClick={goBack}
                buttonText="Back"
                buttonClass="usa-button-secondary"
                beforeText="«"
              />
            )}
          </div>
        </div>
      </form>
    </>
  );
};

SignInInterruptPage.propTypes = {
  goBack: PropTypes.func,
  goForward: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    isLoggedIn: state.user.login.currentlyLoggedIn,
    formData: state.form.data,
  };
}

export default connect(mapStateToProps)(SignInInterruptPage);
