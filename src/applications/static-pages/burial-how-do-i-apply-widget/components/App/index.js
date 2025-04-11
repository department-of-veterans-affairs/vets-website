import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleLoginModal as toggleLoginModalAction } from '@department-of-veterans-affairs/platform-site-wide/actions';

export const App = ({ loggedIn, toggleLoginModal }) => {
  const setReturnUrl = () => {
    sessionStorage.setItem(
      'authReturnUrl',
      `${window.location.origin}/burials-and-memorials/application/530/introduction/`,
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
        Our online burial benefits form isn’t working right now
      </h3>
      <div id="alert-description">
        {loggedIn ? (
          <>
            <p>
              You can still apply for a VA burial allowance by mail. Download
              the PDF form we provide on this page.
            </p>
            <p>
              If you started your form online already, you’ll need to start over
              using a PDF form. But you can still sign in to VA.gov to refer to
              the information you saved in your online form.
            </p>
            <a href="/burials-and-memorials/application/530/introduction">
              Refer to your saved form
            </a>
          </>
        ) : (
          <>
            <p>
              You can still apply for a VA burial allowance by mail. Download
              the PDF form we provide on this page.
            </p>
            <p>
              If you started your form online already, you’ll need to start over
              using a PDF form. But you can still sign in to VA.gov to refer to
              the information you saved in your online form.
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
