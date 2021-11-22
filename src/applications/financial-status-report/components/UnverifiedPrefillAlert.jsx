import React from 'react';
import { connect } from 'react-redux';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';

const UnverifiedPrefillAlert = props => (
  <div className="usa-alert usa-alert-info schemaform-sip-alert">
    <div className="usa-alert-body">
      <h3 className="usa-alert-heading">Please sign in to submit a request</h3>
      <div className="usa-alert-text">
        <p>
          Try signing in with your DS Logon, My HealtheVet, or ID. me account.
          If you don't have any of those accounts, you can create one.
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
          <button
            className="usa-button-primary"
            type="button"
            onClick={() => props.toggleLoginModal(true, 'cta-form')}
          >
            Sign in or create an account
          </button>
        </p>
      </div>
    </div>
  </div>
);

const mapDispatchToProps = {
  toggleLoginModal,
};

export default connect(
  null,
  mapDispatchToProps,
)(UnverifiedPrefillAlert);
