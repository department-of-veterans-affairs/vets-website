import React from 'react';
import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const LoginInWidget = ({ toggleLoginModal, user }) => {
  const toggleLogin = e => {
    e.preventDefault();
    toggleLoginModal(true, 'cta-form');
  };

  const visitorUI = (
    <va-alert-sign-in variant="signInRequired" visible heading-level={3}>
      <span slot="SignInButton">
        <va-button onClick={toggleLogin} text="Sign in or create an account" />
      </span>
    </va-alert-sign-in>
  );

  const spinner = (
    <div className="vads-u-margin-y--5">
      <va-loading-indicator
        label="Loading"
        message="Please wait while we load the application for you."
        set-focus
      />
    </div>
  );

  const loggedInUserUI = (
    <a
      className="vads-c-action-link--green"
      href="/education/download-letters/letters"
    >
      Download your VA education decision letter
    </a>
  );

  const renderUI = () => {
    if (!user?.login?.currentlyLoggedIn && !user?.login?.hasCheckedKeepAlive) {
      return spinner;
    }
    if (user?.login?.currentlyLoggedIn) {
      return loggedInUserUI;
    }

    return visitorUI;
  };

  return renderUI();
};

LoginInWidget.propTypes = {
  toggleLoginModal: PropTypes.func,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.user || {},
});

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: open => dispatch(toggleLoginModalAction(open)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginInWidget);
