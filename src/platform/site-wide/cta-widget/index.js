import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';

import { toggleLoginModal } from '../user-nav/actions';
import { verify } from '../../user/authentication/utilities';

import {
  createAndUpgradeMHVAccount,
  fetchMHVAccount,
  upgradeMHVAccount
} from '../../user/profile/actions';

import { isLoggedIn, selectProfile } from '../../user/selectors';

const lowerEnvironments = [
  'development',
  'staging',
  'devpreview',
  'preview',
  'vagovdev',
  'vagovstaging'
];

const mhvDomain = lowerEnvironments.includes(__BUILDTYPE__) ?
  'https://mhv-syst.myhealth.va.gov' :
  'https://www.myhealth.va.gov';

const urlMap = {
  '/health-care/secure-messaging/': `${mhvDomain}/mhv-portal-web/secure-messaging`,

  '/health-care/refill-track-prescriptions/': `${mhvDomain}/mhv-portal-web/web/myhealthevet/refill-prescriptions`,

  '/health-care/schedule-view-va-appointments/': `${mhvDomain}/mhv-portal-web/web/myhealthevet/scheduling-a-va-appointment`,

  '/health-care/view-test-and-lab-results/': `${mhvDomain}/mhv-portal-web/labs-tests`
};

export class CallToActionWidget extends React.Component {
  constructor(props) {
    super(props);
    this._popup = null;
  }

  componentDidMount() {
    if (this.props.isLoggedIn) this.props.fetchMHVAccount();
  }

  componentDidUpdate() {
    if (!this.props.isLoggedIn) return;

    if (this.hasService() && !this._popup) this.redirect();

    const { accountState, loading } = this.props.mhvAccount;
    if (!loading && !accountState) this.props.fetchMHVAccount();
  }

  getContent = () => {
    if (!this.props.isLoggedIn) {
      return {
        heading: 'You’ll need to sign in before you can send secure messages to your health care team',
        alertText: <p>Try signing in with your DS Logon, My HealtheVet, or ID.me account. If you don’t have any of those accounts, you can create one.</p>,
        buttonText: 'Sign In or Create an Account',
        buttonHandler: this.openLoginModal,
        status: 'warning'
      };
    }

    if (!this.hasService()) return this.getInaccessibleContent();

    return {
      heading: 'My HealtheVet should open in a new tab',
      alertText: <p>If you don’t see My HealtheVet open in a new tab, try disabling your browser’s popup blocker.</p>,
      buttonText: 'Go to My HealtheVet',
      buttonHandler: this.redirect
    };
  }

  getInaccessibleContent = () => {
    const { accountState } = this.props.mhvAccount;

    switch (accountState) {
      case 'needs_identity_verification':
        return {
          heading: 'Please verify your identity to send secure messages to your health care team',
          alertText: <p>We take your privacy seriously, and we’re committed to protecting your information. You’ll need to verify your identity before we can give you access to your personal health information.</p>,
          buttonText: 'Verify Your Identity',
          buttonHandler: verify,
          status: 'warning'
        };

      case 'needs_ssn_resolution':
        return {
          headline: 'We need to verify your identity before giving you access to your personal health information',
          alertText: (
            <div>
              <p>We’re sorry. We can’t match the information you provided with what we have in our Veteran records. We take your privacy seriously, and we’re committed to protecting your information. You won’t be able to access VA.gov health tools until we match your information and verify your identity.</p>
              <h5>What you can do</h5>
              <p>If you feel you’ve entered your information correctly, please call the VA.gov Help Desk at <a href="tel:855-574-7286">1-855-574-7286</a> (TTY: <a href="tel:18008778339">1-800-877-8339</a>). We’re here Monday&#8211;Friday, 8:00 a.m.&#8211;8:00 p.m. (ET).</p>
            </div>
          ),
          status: 'error'
        };

      case 'has_deactivated_mhv_ids':
        return {
          headline: 'It looks like your My HealtheVet account has been disabled',
          alertText: (
            <div>
              <p>We’re sorry. You won’t be able to access VA.gov health tools until we reactivate your My HealtheVet account.</p>
              <h5>What you can do</h5>
              <p>If you feel you’ve entered your information correctly, please call the VA.gov Help Desk at <a href="tel:855-574-7286">1-855-574-7286</a> (TTY: <a href="tel:18008778339">1-800-877-8339</a>). We’re here Monday&#8211;Friday, 8:00 a.m.&#8211;8:00 p.m. (ET).</p>
            </div>
          ),
          status: 'error'
        };

      case 'has_multiple_active_mhv_ids':
        return {
          headline: 'It looks like you have more than one My HealtheVet account',
          alertText: (
            <div>
              <p>We’re sorry. We found more than one active account for you.</p>
              <h5>What you can do</h5>
              <p>Please call the VA.gov Help Desk at <a href="tel:855-574-7286">1-855-574-7286</a> (TTY: <a href="tel:18008778339">1-800-877-8339</a>). We’re here Monday&#8211;Friday, 8:00 a.m.&#8211;8:00 p.m. (ET).</p>
            </div>
          ),
          status: 'error'
        };

      case 'no_account':
        return {
          heading: 'You’ll need to create a My HealtheVet account before you can send secure messages to your health care team',
          buttonText: 'Create a My HealtheVet Account',
          buttonHandler: this.props.createAndUpgradeMHVAccount,
          status: 'warning'
        };

      case 'existing':
      case 'registered':
        return {
          heading: 'You’ll need to upgrade your account before you can send secure messages to your health care team',
          buttonText: 'Upgrade Your Account',
          buttonHandler: this.props.upgradeMHVAccount,
          status: 'warning'
        };

      case 'registered_failed':
        return {
          heading: 'There’s a problem with VA.gov health tools',
          alertText: (
            <div>
              <p>We’re sorry. Something went wrong on our end that’s affecting VA.gov health tools right now.</p>
              <p>You can try again later or call the VA.gov Help Desk at <a href="tel:855-574-7286">1-855-574-7286</a> (TTY: <a href="tel:18008778339">1-800-877-8339</a>). We’re here Monday&#8211;Friday, 8:00 a.m.&#8211;8:00 p.m. (ET).</p>
            </div>
          ),
          status: 'error'
        };

      case 'upgrade_failed':
        return {
          heading: 'Something went wrong with upgrading your account',
          alertText: (
            <div>
              <p>We’re sorry. Something went wrong on our end while we were trying to upgrade your account. You won’t be able to use VA.gov health tools until we can fix the problem.</p>
              <h5>What you can do</h5>
              <p>If you feel you’ve entered your information correctly, please call the VA.gov Help Desk at <a href="tel:855-574-7286">1-855-574-7286</a> (TTY: <a href="tel:18008778339">1-800-877-8339</a>). We’re here Monday&#8211;Friday, 8:00 a.m.&#8211;8:00 p.m. (ET).</p>
            </div>
          ),
          status: 'error'
        };

      default: // Return default content outside of block.
    }

    return {
      heading: 'Some VA.gov health tools aren’t working right now',
      alertText: (
        <div>
          <p>We’re sorry. Something went wrong on our end while looking up your account. You may not be able to use some VA.gov health tools until we can figure out what’s wrong.</p>
          <h5>What you can do</h5>
          <p>You can try again later or call the VA.gov Help Desk at <a href="tel:855-574-7286">1-855-574-7286</a> (TTY: <a href="tel:18008778339">1-800-877-8339</a>). We’re here Monday&#8211;Friday, 8:00 a.m.&#8211;8:00 p.m. (ET).</p>
        </div>
      ),
      status: 'error'
    };
  }

  hasService = () => this.props.availableServices.includes(this.props.serviceRequired);

  openLoginModal = () => this.props.toggleLoginModal(true);

  redirect = () => {
    const redirectUrl = urlMap[location.pathname];
    this._popup = window.open(redirectUrl, 'cta-popup');
    if (this._popup) this._popup.focus();
  }

  render() {
    if (this.props.profile.loading || this.props.mhvAccount.loading) {
      return <LoadingIndicator setFocus message="Loading your information..."/>;
    }

    const {
      heading,
      alertText,
      buttonText,
      buttonHandler,
      status = 'info'
    } = this.getContent();

    const alertProps = {
      headline: heading,
      content: (
        <div className="usa-alert-text">
          {alertText}
          {buttonText && <button className="usa-button-primary" onClick={buttonHandler}>{buttonText}</button>}
        </div>
      ),
      status
    };

    return <AlertBox isVisible {...alertProps}/>;
  }
}

const mapStateToProps = (state) => {
  const profile = selectProfile(state);
  const { loading, mhvAccount, services } = profile;
  return {
    availableServices: services,
    isLoggedIn: isLoggedIn(state),
    profile: { loading },
    mhvAccount
  };
};

const mapDispatchToProps = {
  createAndUpgradeMHVAccount,
  fetchMHVAccount,
  toggleLoginModal,
  upgradeMHVAccount
};

export default connect(mapStateToProps, mapDispatchToProps)(CallToActionWidget);
