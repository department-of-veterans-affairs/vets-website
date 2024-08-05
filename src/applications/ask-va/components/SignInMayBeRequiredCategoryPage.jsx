import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';

const SignInMayBeRequiredCategoryPage = ({ loggedIn }) => {
  const [visibleAlert, setVisibleAlert] = useState(true);
  // Render for users that are Unauthenticated
  return !loggedIn ? (
    <>
      <VaAlert
        close-btn-aria-label="Close notification"
        status="continue"
        visible={visibleAlert}
        uswds
        closeable
        onCloseEvent={() => setVisibleAlert(false)}
      >
        <h2 id="track-your-status-on-mobile" slot="headline">
          Sign in may be required
        </h2>
        <p className="vads-u-margin-y--0">
          If your question is about <b> Education benefits and work study </b>
          or <b>Debt for benefit overpayments and health care copay bill </b>
          you need to sign in.
        </p>
      </VaAlert>
    </>
  ) : null;
};

SignInMayBeRequiredCategoryPage.propTypes = {
  loggedIn: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    loggedIn: isLoggedIn(state),
  };
}

export default connect(mapStateToProps)(SignInMayBeRequiredCategoryPage);
