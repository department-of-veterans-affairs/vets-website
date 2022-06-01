import React, { useCallback } from 'react';
import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export const UnauthenticatedPageContent = toggleLoginModal => {
  const onSignInClicked = useCallback(() => toggleLoginModal(true), [
    toggleLoginModal,
  ]);
  return (
    <>
      <h2>Connected devices</h2>
      <va-alert
        close-btn-aria-label="Close notification"
        status="continue"
        visible
      >
        <h3 slot="headline">Please sign in to connect a device</h3>
        <div>
          Sign in with your existing ID.me, DS Logon, or My HealtheVet account.
          If you don’t have any of these accounts, you can create a free ID.me
          account now.
        </div>
        <button type="button" className="usa-button" onClick={onSignInClicked}>
          Sign in or create an account
        </button>
      </va-alert>
    </>
  );
};

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: open => dispatch(toggleLoginModalAction(open)),
});

export default connect(
  null,
  mapDispatchToProps,
)(UnauthenticatedPageContent);

UnauthenticatedPageContent.propTypes = {
  toggleLoginModal: PropTypes.func,
};
