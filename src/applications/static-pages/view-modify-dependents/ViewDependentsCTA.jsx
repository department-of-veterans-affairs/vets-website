import React, { Component } from 'react';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';

class ViewDependentsCTA extends Component {
  render() {
    return (
      <div className="va-sign-in-alert usa-alert usa-alert-info">
        <div className="usa-alert-body">
          <h4 className="usa-alert-heading">
            You’ll need to sign in to eBenefits to change your VA direct deposit
            and contact information online.
          </h4>
          <p className="usa-alert-text">
            To use this feature, you'll need a Premium <b>DS Logon</b> account.
            Your My HealtheVet or ID.me credentials won’t work on the eBenefits
            website. Go to eBenefits to sign in, register, or upgrade your{' '}
            <b>DS Logon</b> account to Premium.
            <a
              className="usa-button-primary"
              href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=direct-deposit-and-contact-information"
            >
              Go to eBenefits to change your information
            </a>
          </p>
        </div>
      </div>
    );
  }
}

export default ViewDependentsCTA;
