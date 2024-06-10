import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SignInModal from 'platform/user/authentication/components/SignInModal';
import { signInServiceEnabled } from 'platform/user/authentication/selectors';

const SignIn = ({ useSignInService }) => {
  const [showModal, setShowModal] = useState(false);

  const toggle = () => {
    console.log('clicking the sign in button');
    setShowModal(prev => !prev);
  }

  useEffect(() => {
    document.getElementsByClassName('sign-in-button').forEach(() => {
      addEventListener('click', toggle)
    });
  }, []);

  console.log('showModal: ' , showModal);

  return (
    <SignInModal
      visible={showModal}
      onClose={toggle}
      useSiS={useSignInService}
    />
  );
}

SignIn.propTypes = {
  useSignInService: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    useSignInService: signInServiceEnabled(state),
  };
};

export default connect(mapStateToProps)(SignIn);