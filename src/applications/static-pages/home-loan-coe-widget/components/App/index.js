import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Relative imports.
import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';
import ServiceProvidersText, {
  ServiceProvidersTextCreateAcct,
} from 'platform/user/authentication/components/ServiceProvidersText';

export const App = ({ toggleLoginModal }) => {
  return (
    <va-alert status="continue" visible>
      <h3 slot="headline">Please sign in to check the status of your COE</h3>
      <p>
        Sign in with your existing <ServiceProvidersText isBold /> account.{' '}
        <ServiceProvidersTextCreateAcct />
      </p>
      <button
        className="va-button-primary"
        onClick={() => toggleLoginModal(true)}
      >
        Sign in or create an account
      </button>
    </va-alert>
  );
};

App.propTypes = {
  // From mapDispatchToProps.
  toggleLoginModal: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: open => dispatch(toggleLoginModalAction(open)),
});

export default connect(
  null,
  mapDispatchToProps,
)(App);
