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
    <va-alert
      close-btn-aria-label="Close notification"
      status="continue"
      visible
    >
      <p
        className="vads-u-font-size--h3 vads-u-font-weight--bold vads-u-font-family--serif"
        slot="headline"
      >
        Sign in to download your VA education decision letter
      </p>
      <div>
        Sign in with your existing{' '}
        <span className="vads-u-font-weight--bold">ID.me</span> or{' '}
        <span className="vads-u-font-weight--bold">Login.gov</span> account. If
        you don’t have any of these accounts, you can create a free{' '}
        <a
          className="vads-u-font-weight--bold"
          href="https://www.id.me/"
          target="_blank"
          rel="noreferrer"
        >
          ID.me
        </a>{' '}
        account or{' '}
        <a
          className="vads-u-font-weight--bold"
          href="https://secure.login.gov/"
          target="_blank"
          rel="noreferrer"
        >
          Login.gov
        </a>{' '}
        account now.
      </div>
      <va-button
        onClick={toggleLogin}
        primary-alternate
        text="Sign in or create an account"
      />
    </va-alert>
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
