import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { VaAlertSignIn } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { toggleLoginModal } from '@department-of-veterans-affairs/platform-site-wide/actions';

const Unauthed = ({ headerLevel = 3 }) => {
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

Unauthed.propTypes = {
  headerLevel: PropTypes.number,
};

export default Unauthed;
