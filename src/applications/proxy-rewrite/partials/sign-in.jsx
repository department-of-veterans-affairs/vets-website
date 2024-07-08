import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SignInModal from 'platform/user/authentication/components/SignInModal';
import { signInServiceEnabled } from 'platform/user/authentication/selectors';

const SignIn = ({ useSignInService }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const toggle = useCallback(
    () => {
      setModalIsOpen(!modalIsOpen);
    },
    [setModalIsOpen, modalIsOpen],
  );

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
      visible={modalIsOpen}
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
