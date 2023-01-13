import React from 'react';
import PropTypes from 'prop-types';
import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';
import { connect } from 'react-redux';

const LoginInWidget = ({ toggleLoginModal }) => {
  function toggleLogin(e) {
    e.preventDefault();
    toggleLoginModal(true, 'cta-form');
  }
  return (
    <va-alert
      close-btn-aria-label="Close notification"
      status="continue"
      visible
    >
      <p
        className="vads-u-font-size--h3 vads-u-font-weight--bold vads-u-font-family--serif"
        slot="headline"
      >
        Please sign in to verify your VA education letter.
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
      <button className="va-button" type="button" onClick={toggleLogin}>
        Sign in or create an account
      </button>
    </va-alert>
  );
};
LoginInWidget.propTypes = {
  toggleLoginModal: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: open => dispatch(toggleLoginModalAction(open)),
});

export default connect(
  null,
  mapDispatchToProps,
)(LoginInWidget);
