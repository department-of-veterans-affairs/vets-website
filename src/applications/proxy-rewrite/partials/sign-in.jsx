import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SignInModal from 'platform/user/authentication/components/SignInModal';
import { signInServiceEnabled } from 'platform/user/authentication/selectors';

const SignIn = ({ useSignInService }) => {
  const [showModal, setShowModal] = useState(false);

  const toggle = useCallback(() => {
    setShowModal(!showModal);
  }, [showModal]);

  useEffect(
    () => {
      const signInButtons = document.getElementsByClassName('sign-in-button');

      signInButtons.forEach(button => button.addEventListener('click', toggle));

      return () => {
        signInButtons.forEach(button =>
          button.removeEventListener('click', toggle),
        );
      };
    },
    [toggle],
  );

  return (
    <SignInModal
      visible={showModal}
      onClose={toggle}
      useSiS={useSignInService}
    />
  );
};

SignIn.propTypes = {
  useSignInService: PropTypes.bool,
};

const mapStateToProps = state => {
  return {
    useSignInService: signInServiceEnabled(state),
  };
};

export default connect(mapStateToProps)(SignIn);
