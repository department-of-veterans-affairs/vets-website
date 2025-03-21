import {
  VaAlertSignIn,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  VerifyIdmeButton,
  VerifyLogingovButton,
} from 'platform/user/authentication/components/VerifyButton';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import ProgressButton from '~/platform/forms-system/src/js/components/ProgressButton';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import { signInServiceName } from '~/platform/user/authentication/selectors';
import manifest from '../manifest.json';

const SignInInterruptPage = ({ goBack, goForward, formData }) => {
  const isLOA3 = useSelector(state => state.user.profile.loa.current === 3);
  const signInService = useSelector(signInServiceName);

  useEffect(
    () => {
      focusElement('headline.h4');
      if (isLOA3) {
        goForward(formData);
      }
    },
    [isLOA3, goForward, formData],
  );

  const navigateToAskVAAndTriggerLoginModal = () => {
    window.location.href = `${
      manifest.rootUrl
    }/introduction?showSignInModal=true`;
  };

  return (
    <>
      {[CSP_IDS.ID_ME, CSP_IDS.LOGIN_GOV].includes(signInService) ? (
        <VaAlertSignIn
          heading-level={4}
          variant={
            [CSP_IDS.ID_ME].includes(signInService)
              ? 'verifyIdMe'
              : 'verifyLoginGov'
          }
          visible
        >
          {[CSP_IDS.ID_ME].includes(signInService) ? (
            <span slot="IdMeVerifyButton">
              <VerifyIdmeButton />
            </span>
          ) : (
            <span slot="LoginGovVerifyButton">
              <VerifyLogingovButton />
            </span>
          )}
        </VaAlertSignIn>
      ) : (
        <VaAlertSignIn variant="signInRequired" visible headingLevel={4}>
          <span slot="SignInButton">
            <VaButton
              text="Sign in or create an account"
              onClick={navigateToAskVAAndTriggerLoginModal}
            />
          </span>
        </VaAlertSignIn>
      )}

      <div className="row form-progress-buttons schemaform-buttons vads-u-margin-top--6 vads-u-margin-bottom--7">
        {goBack && (
          <ProgressButton
            onButtonClick={goBack}
            buttonText="Back"
            buttonClass="usa-button-secondary vads-u-width--auto vads-u-margin-left--1"
            beforeText="«"
          />
        )}
      </div>
    </>
  );
};

SignInInterruptPage.propTypes = {
  formData: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    formData: state.form.data,
  };
}

export default connect(mapStateToProps)(SignInInterruptPage);
