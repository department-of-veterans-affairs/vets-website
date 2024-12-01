import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import ServiceProvidersText, {
  ServiceProvidersTextCreateAcct,
} from 'platform/user/authentication/components/ServiceProvidersText';

const buttonText = 'Sign in or create an account';

const UnverifiedPrefillAlert = ({ toggle }) => (
  <div className="usa-alert usa-alert-info schemaform-sip-alert">
    <div className="usa-alert-body">
      <h3 className="usa-alert-heading">Please sign in to submit a request</h3>
      <div className="usa-alert-text">
        <p>
          Sign in in with your existing <ServiceProvidersText /> account.{' '}
          <ServiceProvidersTextCreateAcct />
        </p>
        <p>When you’re signed in to your VA.gov account:</p>
        <ul>
          <li>
            We can prefill part of your order based on your account details.
          </li>
          <li>
            You can save your request in progress, and come back later to finish
            filling it out. You’ll have 60 days from the date you start or
            update your request to submit it. After 60 days, we’ll delete the
            form and you’ll need to start over.
          </li>
        </ul>
        <p>
          <va-button
            text={buttonText}
            onClick={() => toggle(true, 'cta-form')}
          />
        </p>
      </div>
    </div>
  </div>
);

UnverifiedPrefillAlert.propTypes = {
  toggle: PropTypes.func,
};

const mapDispatchToProps = {
  toggle: toggleLoginModal,
};

export default connect(
  null,
  mapDispatchToProps,
)(UnverifiedPrefillAlert);
