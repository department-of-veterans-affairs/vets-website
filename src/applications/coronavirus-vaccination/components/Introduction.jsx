import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/formation-react/AlertBox';

import * as userNavActions from 'platform/site-wide/user-nav/actions';
import * as userSelectors from 'platform/user/selectors';

function Introduction({ isLoggedIn, toggleLoginModal }) {
  return (
    <>
      <h2>Introduction</h2>
      <div className="va-introtext">
        <p>This is an introduction</p>
      </div>
      {isLoggedIn ? (
        <AlertBox
          status={ALERT_TYPE.SUCCESS}
          headline="You’re all set"
          content={
            <Link className="usa-button" to="/apply">
              Begin the application
            </Link>
          }
        />
      ) : (
        <AlertBox
          status={ALERT_TYPE.INFO}
          headline="Save time by signing in before you start your application"
          content={
            <>
              <p>
                <button onClick={toggleLoginModal} className="usa-button">
                  Begin the application
                </button>
              </p>
              <p>
                <Link to="/apply">Continue without signing in</Link>
              </p>
            </>
          }
        />
      )}
    </>
  );
}

const mapStateToProps = state => {
  return {
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
