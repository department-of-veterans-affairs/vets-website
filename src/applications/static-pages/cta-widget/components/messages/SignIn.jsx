import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { VaAlertSignIn } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { toggleLoginModal } from '@department-of-veterans-affairs/platform-site-wide/actions';

const SignIn = ({ headerLevel = 3 }) => {
  const dispatch = useDispatch();

  return (
    <VaAlertSignIn variant="signInRequired" visible headingLevel={headerLevel}>
      <span slot="SignInButton">
        <va-button
          text="Sign in or create an account"
          onClick={() => dispatch(toggleLoginModal(true, '', true))}
        />
      </span>
    </VaAlertSignIn>
  );
};

SignIn.propTypes = {
  primaryButtonHandler: PropTypes.func.isRequired,
  serviceDescription: PropTypes.string.isRequired,
  ariaDescribedby: PropTypes.string,
  ariaLabel: PropTypes.string,
  headerLevel: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default SignIn;
