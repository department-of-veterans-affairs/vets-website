import React from 'react';
import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export const UnauthenticatedPageContent = ({ toggleLoginModal }) => {
  return (
    <>
      <h2>Connected devices</h2>
      <va-alert-sign-in variant="signInRequired" visible>
        <span slot="SignInButton">
          <va-button
            text="Sign in or create an account"
            onClick={toggleLoginModal}
          />
        </span>
      </va-alert-sign-in>
    </>
  );
};

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: () => dispatch(toggleLoginModalAction(true)),
});

export default connect(
  null,
  mapDispatchToProps,
)(UnauthenticatedPageContent);

UnauthenticatedPageContent.propTypes = {
  toggleLoginModal: PropTypes.func,
};
