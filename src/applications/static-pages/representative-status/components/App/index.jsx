import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleLoginModal as toggleLoginModalAction } from '@department-of-veterans-affairs/platform-site-wide/actions';

export const App = ({ loggedIn, toggleLoginModal }) => {
  return (
    <>
      {loggedIn ? null : (
        <va-alert
          close-btn-aria-label="Close notification"
          status="continue"
          visible
        >
          <h2 id="track-your-status-on-mobile" slot="headline">
            Sign in to check if you have an accredited representative
          </h2>
          <React.Fragment key=".1">
            <p>
              Sign in with your existing{' '}
              <strong>Login.gov, ID.me, DS Logon,</strong> or{' '}
              <strong>My HealtheVet</strong> account. If you don’t have any of
              these accounts, you can create a free <strong>Login.gov</strong>{' '}
              or <strong>ID.me</strong> account now.
            </p>
            <va-button
              primary-alternate
              text="Sign in or create an account"
              uswds
              onClick={() => toggleLoginModal(true)}
            />
          </React.Fragment>
        </va-alert>
      )}
    </>
  );
};

App.propTypes = {
  toggleLoginModal: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool,
};

const mapStateToProps = state => ({
  loggedIn: state?.user?.login?.currentlyLoggedIn || null,
});

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: open => dispatch(toggleLoginModalAction(open)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
