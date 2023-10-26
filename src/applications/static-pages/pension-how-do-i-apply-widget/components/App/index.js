import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleLoginModal as toggleLoginModalAction } from '@department-of-veterans-affairs/platform-site-wide/actions';

export const App = ({ loggedIn, toggleLoginModal }) => {
  const setReturnUrl = () => {
    sessionStorage.setItem(
      'authReturnUrl',
      `${window.location.origin}/pension/application/527EZ/introduction/`,
    );
  };
  return (
    <va-alert
      close-btn-aria-label="Close notification"
      status="info"
      visible
      aria-labelledby="alert-heading"
      aria-describedby="alert-description"
    >
      <h3 id="alert-heading" slot="headline">
        Our online pension form isn’t working right now
      </h3>
      <div id="alert-description">
        {loggedIn ? (
          <>
            <p>
              You can still apply for VA pension benefits by mail, in person at
              a VA regional office, or with the help of a Veterans Service
              Officer (VSO) or another accredited representative. Download the
              PDF form we provide on this page.
            </p>
            <h4>If you started your form online already</h4>
            <p>
              You’ll need to start over using a PDF form. But you can still
              refer to the information you saved in your online form.
            </p>
            <p>
              <strong>Note: </strong>
              We’ll record the potential start date for your benefits as the
              date you first saved your online form. You have 1 year from this
              date to submit your application. If we approve your claim, you may
              be able to get retroactive payments.
            </p>
            <a href="/pension/application/527EZ/introduction/">
              Refer to your saved form
            </a>
          </>
        ) : (
          <>
            <p>
              You can still apply for VA pension benefits by mail, in person at
              a VA regional office, or with the help of a Veterans Service
              Officer (VSO) or another accredited representative. Download the
              PDF form we provide on this page.
            </p>
            <h4>If you started your form online already</h4>
            <p>
              You’ll need to start over using a PDF form. But you can still sign
              in to VA.gov to refer to the information you saved in your online
              form.
            </p>
            <p>
              <strong>Note: </strong>
              We’ll record the potential start date for your benefits as the
              date you first saved your online form. You have 1 year from this
              date to submit your application. If we approve your claim, you may
              be able to get retroactive payments.
            </p>
            <va-button
              onClick={() => {
                setReturnUrl();
                toggleLoginModal(true);
              }}
              text="Sign in to VA.gov"
            />
          </>
        )}
      </div>
    </va-alert>
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
