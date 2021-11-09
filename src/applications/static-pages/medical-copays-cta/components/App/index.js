// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';

export const App = ({ loggedIn, show, toggleLoginModal }) => {
  if (!show) {
    return null;
  }

  return (
    <va-alert status="info">
      {/* Title */}
      <h2 slot="headline" className="vads-u-font-size--h3">
        View your VA copay balances
      </h2>

      {/* Explanation */}
      <p>With this tool, you can:</p>
      <ul>
        <li>View your balances for each of your medical facilities</li>
        <li>See your copay charges and payments</li>
        <li>Download your copay statements</li>
        <li>Find the right repayment option for you</li>
      </ul>

      {/* Call to action button/link */}
      {loggedIn ? (
        <a
          className="vads-c-action-link--blue vads-u-margin-top--2"
          href="/health-care/pay-copay-bill/your-current-balances/"
        >
          View your current copay balances
        </a>
      ) : (
        <button className="usa-button" onClick={() => toggleLoginModal(false)}>
          Sign in or create an account
        </button>
      )}
    </va-alert>
  );
};

App.propTypes = {
  // From mapStateToProps.
  loggedIn: PropTypes.bool,
  show: PropTypes.bool,
  // From mapDispatchToProps.
  toggleLoginModal: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  loggedIn: state?.user?.login?.currentlyLoggedIn || false,
  show: state?.featureToggles?.showMedicalCopays,
});

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: open => dispatch(toggleLoginModalAction(open)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
