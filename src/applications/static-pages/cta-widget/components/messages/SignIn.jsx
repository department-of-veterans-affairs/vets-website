import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { VaAlertSignIn } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { toggleLoginModal } from '@department-of-veterans-affairs/platform-site-wide/actions';

const SignIn = ({ headerLevel = 3, requiresVerification = false }) => {
  const dispatch = useDispatch();
  const onClick = () =>
    dispatch(toggleLoginModal(true, '', requiresVerification));

  return (
    <VaAlertSignIn variant="signInRequired" visible headingLevel={headerLevel}>
      <span slot="SignInButton">
        <va-button text="Sign in or create an account" onClick={onClick} />
      </span>
    </VaAlertSignIn>
  );
};

SignIn.propTypes = {
  headerLevel: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  requiresVerification: PropTypes.bool,
};

export default SignIn;
