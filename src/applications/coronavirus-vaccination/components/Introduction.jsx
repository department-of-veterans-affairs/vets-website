import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import * as userNavActions from 'platform/site-wide/user-nav/actions';
import * as userSelectors from 'platform/user/selectors';

function Introduction({ isProfileLoading, isLoggedIn, toggleLoginModal }) {
  let callToAction = <LoadingIndicator message="Loading your profile..." />;

  if (!isProfileLoading) {
    if (isLoggedIn) {
      callToAction = (
        <AlertBox
          status={ALERT_TYPE.SUCCESS}
          headline="You’re all set"
          content={
            <Link className="usa-button" to="/apply">
              Begin the application
            </Link>
          }
        />
      );
    } else {
      callToAction = (
        <AlertBox
          status={ALERT_TYPE.INFO}
          headline="Save time by signing in before you start your application"
          content={
            <button onClick={toggleLoginModal} className="usa-button">
              Begin the application
            </button>
          }
        />
      );
    }
  }

  return (
    <>
      <h2>Introduction</h2>
      <div className="va-introtext">
        <p>This is an introduction</p>
      </div>
      {callToAction}
    </>
  );
}

const mapStateToProps = state => {
  return {
    isProfileLoading: userSelectors.isProfileLoading(state),
    isLoggedIn: userSelectors.isLoggedIn(state),
  };
};

const mapDispatchToProps = {
  toggleLoginModal: userNavActions.toggleLoginModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Introduction);
export { Introduction };
