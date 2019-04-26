import React from 'react';

import recordEvent from 'platform/monitoring/record-event';
import localStorage from 'platform/utilities/storage/localStorage';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import BetaTools from '../containers/BetaTools';

import AccountVerification from './AccountVerification';
import ConnectedAccountsSection from './ConnectedAccountsSection.jsx';
import LoginSettings from './LoginSettings';
import MultifactorMessage from './MultifactorMessage';
import TermsAndConditions from './TermsAndConditions';
import facilityLocator from 'applications/facility-locator/manifest';

class AccountMain extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      'show-acct-mvi-alert': true,
    };
  }

  componentDidMount() {
    // Get MHV account to determine what to render for Terms and Conditions.
    this.props.fetchMHVAccount();
  }

  dismissMVIError = () => {
    this.setState({
      'show-acct-mvi-alert': false,
    });
    localStorage.setItem('hide-acct-mvi-alert', true);
  };

  renderMVIError() {
    if (
      this.props.profile.loa.current === 1 ||
      this.props.profile.status === 'OK'
    ) {
      return null;
    }

    return (
      <AlertBox
        content={
          <div>
            <h4 className="usa-alert-heading">
              We’re having trouble matching your information to our Veteran
              records
            </h4>
            <p>
              We’re sorry. We’re having trouble matching your information to our
              Veteran records, so we can’t give you access to tools for managing
              your health and benefits.
            </p>
            <p>
              If you’d like to use these tools on VA.gov, please contact your
              nearest VA medical center. Let them know you need to verify the
              information in your records, and update it as needed. The
              operator, or a patient advocate, can connect you with the right
              person who can help.
            </p>
            <p>
              <a href={facilityLocator.rootUrl}>
                Find your nearest VA medical center
              </a>
            </p>
          </div>
        }
        onCloseAlert={this.dismissMVIError}
        isVisible={
          this.state['show-acct-mvi-alert'] &&
          !localStorage.getItem('hide-acct-mvi-alert')
        }
        status="warning"
      />
    );
  }

  render() {
    const {
      loa,
      loading,
      mhvAccount,
      multifactor,
      verified,
    } = this.props.profile;

    if (loading || mhvAccount.loading) {
      return <LoadingIndicator message="Loading your account information..." />;
    }

    return (
      <div>
        <AccountVerification loa={loa} />
        {this.renderMVIError()}
        <MultifactorMessage multifactor={multifactor} />
        <div>
          <div>
            <h3>Sign in settings</h3>
            <p>
              You can update the email or password you use to sign in to VA.gov.
              Just go to the account you use to sign in (DS Logon, My
              HealtheVet, or ID.me) and manage your settings.
            </p>
          </div>
          <div>
            <h5>DS Logon</h5>
            <a
              href="https://myaccess.dmdc.osd.mil/identitymanagement"
              rel="noopener noreferrer"
              target="_blank"
            >
              Manage your DS Logon account
            </a>
            <span className="external-link-icon-black">&nbsp;</span>
          </div>
          <div>
            <h5>My HealtheVet</h5>
            <a
              href="https://www.myhealth.va.gov"
              rel="noopener noreferrer"
              target="_blank"
            >
              Manage your My HealtheVet account
            </a>
            <span className="external-link-icon-black">&nbsp;</span>
          </div>
        </div>
        <LoginSettings />
        <BetaTools />
        <ConnectedAccountsSection />
        {verified && <TermsAndConditions mhvAccount={mhvAccount} />}

        <div className="feature">
          <h3>Have questions about signing in to VA.gov?</h3>
          <p>
            Get answers to frequently asked questions about how to sign in,
            common issues with verifying your identity, and your privacy and
            security on VA.gov.
          </p>
          <a
            href="/sign-in-faq/"
            onClick={() =>
              recordEvent({
                event: 'account-navigation',
                'account-action': 'view-link',
                'account-section': 'vets-faqs',
              })
            }
          >
            Go to VA.gov FAQs
          </a>
        </div>
      </div>
    );
  }
}

export default AccountMain;
