// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleLoginModal as toggleLoginModalAction } from '@department-of-veterans-affairs/platform-site-wide/actions';

export const App = ({ loggedIn, toggleLoginModal }) => {
  return (
    <va-alert close-btn-aria-label="Close notification" status="info" visible>
      <h2
        className="vads-u-font-size--h3"
        id="track-your-status-on-mobile"
        slot="headline"
      >
        Our online pension form isn’t working right now
      </h2>
      <div>
        <p className="vads-u-margin-y--0">
          You can still apply for VA pension benefits by mail, in person at a VA
          regional office, or with the help of a Veterans Service Officer (VSO)
          or another accredited representative. Download the PDF form we provide
          on this page.
        </p>
        <p className="vads-u-margin-y--0">
          If you started your form online already, you’ll need to start over
          using a PDF form. But you can still refer to the information you saved
          in your online form.
        </p>
        {loggedIn ? (
          <a href="/">Refer to your saved form</a>
        ) : (
          <va-button onClick={() => toggleLoginModal(true)}>
            Sign in or create an account
          </va-button>
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
