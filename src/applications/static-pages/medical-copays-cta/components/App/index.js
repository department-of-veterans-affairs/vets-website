// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import ServiceProvidersText, {
  ServiceProvidersTextCreateAcct,
} from 'platform/user/authentication/components/ServiceProvidersText';
import LoginModalButton from 'platform/user/authentication/components/LoginModalButton';

export const App = ({ loggedIn, show }) => {
  if (!show) {
    return null;
  }

  return (
    <va-alert status={loggedIn ? 'info' : 'continue'}>
      {/* Title */}
      <h3 slot="headline">
        {loggedIn
          ? 'Review your VA copay balances'
          : 'Please sign in to review your VA copay balances'}
      </h3>

      {/* Explanation */}
      {loggedIn ? (
        <p>With this tool, you can:</p>
      ) : (
        <p>
          Sign in with your existing <ServiceProvidersText isBold /> account.{' '}
          <ServiceProvidersTextCreateAcct hasExtraTodo />
        </p>
      )}
      <ul>
        <li>Review your balances for each of your medical facilities</li>
        <li>Download your copay statements</li>
        <li>Find the right repayment option for you</li>
      </ul>

      {/* Call to action button/link */}
      {loggedIn ? (
        <a
          className="vads-c-action-link--blue vads-u-margin-top--2"
          href="/manage-va-debt/summary/copay-balances"
        >
          Review your current copay balances
        </a>
      ) : (
        <LoginModalButton className="va-button-primary" />
      )}
    </va-alert>
  );
};

App.propTypes = {
  // From mapStateToProps.
  loggedIn: PropTypes.bool,
  show: PropTypes.bool,
};

const mapStateToProps = state => ({
  loggedIn: state?.user?.login?.currentlyLoggedIn || false,
  show: state?.featureToggles?.showMedicalCopays,
});

export default connect(mapStateToProps)(App);
