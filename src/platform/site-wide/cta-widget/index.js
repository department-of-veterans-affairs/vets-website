import React from 'react';
import { connect } from 'react-redux';
import appendQuery from 'append-query';
import URLSearchParams from 'url-search-params';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';

import { toggleLoginModal } from '../user-nav/actions';
import { verify } from '../../user/authentication/utilities';
import {
  createAndUpgradeMHVAccount,
  fetchMHVAccount,
  upgradeMHVAccount,
} from '../../user/profile/actions';
import { isLoggedIn, selectProfile } from '../../user/selectors';

import {
  frontendApps,
  redirectUrl,
  requiredServices,
  serviceDescription,
} from './helpers';

const HEALTH_TOOLS = [
  frontendApps.HEALTH_RECORDS,
  frontendApps.RX,
  frontendApps.MESSAGING,
  frontendApps.LAB_AND_TEST_RESULTS,
  frontendApps.APPOINTMENTS,
];

const MHV_ACCOUNT_TYPES = ['Premium', 'Advanced', 'Basic'];

export class CallToActionWidget extends React.Component {
  constructor(props) {
    super(props);
    this._popup = null;
    this._redirectUrl = redirectUrl(window.location.pathname);
    this._requiredServices = requiredServices(props.appId);
    this._serviceDescription = serviceDescription(props.appId);
  }

  componentDidMount() {
    if (this.isHealthTool() && this.props.isLoggedIn) {
      this.props.fetchMHVAccount();
    }
  }

  componentDidUpdate() {
    if (!this.props.isLoggedIn) return;

    if (this.isAccessible()) {
      this.redirect();
    } else if (this.isHealthTool());
    {
      const { accountLevel, accountState, loading } = this.props.mhvAccount;

      if (loading) return;

      if (!accountState) {
        this.props.fetchMHVAccount();
      } else if (
        new URLSearchParams(window.location.search).get('tc_accepted')
      ) {
        // Since T&C is still required to support the existing account states,
        // check the existence of a query param that gets appended after
        // successful T&C acceptance to complete account creation or upgrade.
        if (!accountLevel && accountState !== 'register_failed') {
          this.props.createAndUpgradeMHVAccount();
        } else if (accountLevel && accountState !== 'upgrade_failed') {
          this.props.upgradeMHVAccount();
        }
      }
    }
  }

  getContent = () => {
    if (
      !this.props.isLoggedIn ||
      !this.isHealthTool() /* Only health tools supported for now */
    ) {
      return {
        heading: `You’ll need to sign in before you can ${
          this._serviceDescription
        }`,
        alertText: (
          <p>
            Try signing in with your DS Logon, My HealtheVet, or ID.me account.
            If you don’t have any of those accounts, you can create one.
          </p>
        ),
        buttonText: 'Sign In or Create an Account',
        buttonHandler: this.openLoginModal,
        status: 'warning',
      };
    }

    if (this.props.mhvAccount.errors) {
      return {
        heading: 'Some VA.gov health tools aren’t working right now',
        alertText: (
          <div>
            <p>
              We’re sorry. Something went wrong on our end while looking up your
              account. You may not be able to use some VA.gov health tools until
              we can figure out what’s wrong.
            </p>
            <h5>What you can do</h5>
            <p>
              You can try again later or call the VA.gov Help Desk at{' '}
              <a href="tel:855-574-7286">1-855-574-7286</a> (TTY:{' '}
              <a href="tel:18008778339">1-800-877-8339</a>
              ). We’re here Monday&#8211;Friday, 8:00 a.m.&#8211;8:00 p.m. (ET).
            </p>
          </div>
        ),
        status: 'error',
      };
    }

    if (!this.isAccessible()) return this.getInaccessibleContent();

    return {
      heading: 'My HealtheVet should open in a new tab',
      alertText: (
        <p>
          If you don’t see My HealtheVet open in a new tab, try disabling your
          browser’s popup blocker.
        </p>
      ),
      buttonText: 'Go to My HealtheVet',
      buttonHandler: this.redirect,
    };
  };

  getInaccessibleHealthContent = () => {
    const { accountState } = this.props.mhvAccount;

    switch (accountState) {
      case 'needs_identity_verification':
        return {
          heading: `Please verify your identity to ${this._serviceDescription}`,
          alertText: (
            <p>
              We take your privacy seriously, and we’re committed to protecting
              your information. You’ll need to verify your identity before we
              can give you access to your personal health information.
            </p>
          ),
          buttonText: 'Verify Your Identity',
          buttonHandler: verify,
          status: 'warning',
        };

      case 'needs_ssn_resolution':
        return {
          heading:
            'We need to verify your identity before giving you access to your personal health information',
          alertText: (
            <div>
              <p>
                We’re sorry. We can’t match the information you provided with
                what we have in our Veteran records. We take your privacy
                seriously, and we’re committed to protecting your information.
                You won’t be able to access VA.gov health tools until we match
                your information and verify your identity.
              </p>
              <h5>What you can do</h5>
              <p>
                If you feel you’ve entered your information correctly, please
                call the VA.gov Help Desk at{' '}
                <a href="tel:855-574-7286">1-855-574-7286</a> (TTY:{' '}
                <a href="tel:18008778339">1-800-877-8339</a>
                ). We’re here Monday&#8211;Friday, 8:00 a.m.&#8211;8:00 p.m.
                (ET).
              </p>
            </div>
          ),
          status: 'error',
        };

      case 'has_deactivated_mhv_ids':
        return {
          heading: 'It looks like your My HealtheVet account has been disabled',
          alertText: (
            <div>
              <p>
                We’re sorry. You won’t be able to access VA.gov health tools
                until we reactivate your My HealtheVet account.
              </p>
              <h5>What you can do</h5>
              <p>
                If you feel you’ve entered your information correctly, please
                call the VA.gov Help Desk at{' '}
                <a href="tel:855-574-7286">1-855-574-7286</a> (TTY:{' '}
                <a href="tel:18008778339">1-800-877-8339</a>
                ). We’re here Monday&#8211;Friday, 8:00 a.m.&#8211;8:00 p.m.
                (ET).
              </p>
            </div>
          ),
          status: 'error',
        };

      case 'has_multiple_active_mhv_ids':
        return {
          heading: 'It looks like you have more than one My HealtheVet account',
          alertText: (
            <div>
              <p>We’re sorry. We found more than one active account for you.</p>
              <h5>What you can do</h5>
              <p>
                Please call the VA.gov Help Desk at{' '}
                <a href="tel:855-574-7286">1-855-574-7286</a> (TTY:{' '}
                <a href="tel:18008778339">1-800-877-8339</a>
                ). We’re here Monday&#8211;Friday, 8:00 a.m.&#8211;8:00 p.m.
                (ET).
              </p>
            </div>
          ),
          status: 'error',
        };

      /* Handling for these states to be re-introduced after brand consolidation
       * when VA patient and T&C acceptance checks will no longer gate access, so
       * access to these tools will be accurately reported by the services list.
       * For now, access is determined by MHV account level requirements.
       *
       * case 'no_account':
       *   return {
       *     heading: `You’ll need to create a My HealtheVet account before you can ${this._serviceDescription`,
       *     buttonText: 'Create a My HealtheVet Account',
       *     buttonHandler: this.props.createAndUpgradeMHVAccount,
       *     status: 'warning'
       *   };

       * case 'existing':
       * case 'registered':
       *   return {
       *     heading: `You’ll need to upgrade your account before you can ${this._serviceDescription}`,
       *     buttonText: 'Upgrade Your Account',
       *     buttonHandler: this.props.upgradeMHVAccount,
       *     status: 'warning'
       *   };
       */

      case 'register_failed':
        return {
          heading: 'There’s a problem with VA.gov health tools',
          alertText: (
            <div>
              <p>
                We’re sorry. Something went wrong on our end that’s affecting
                VA.gov health tools right now.
              </p>
              <p>
                You can try again later or call the VA.gov Help Desk at{' '}
                <a href="tel:855-574-7286">1-855-574-7286</a> (TTY:{' '}
                <a href="tel:18008778339">1-800-877-8339</a>
                ). We’re here Monday&#8211;Friday, 8:00 a.m.&#8211;8:00 p.m.
                (ET).
              </p>
            </div>
          ),
          status: 'error',
        };

      case 'upgrade_failed':
        return {
          heading: 'Something went wrong with upgrading your account',
          alertText: (
            <div>
              <p>
                We’re sorry. Something went wrong on our end while we were
                trying to upgrade your account. You won’t be able to use VA.gov
                health tools until we can fix the problem.
              </p>
              <h5>What you can do</h5>
              <p>
                If you feel you’ve entered your information correctly, please
                call the VA.gov Help Desk at{' '}
                <a href="tel:855-574-7286">1-855-574-7286</a> (TTY:{' '}
                <a href="tel:18008778339">1-800-877-8339</a>
                ). We’re here Monday&#8211;Friday, 8:00 a.m.&#8211;8:00 p.m.
                (ET).
              </p>
            </div>
          ),
          status: 'error',
        };

      default: // Handle other content outside of block.
    }

    // If account creation or upgrade isn't blocked by any of the errors we
    // handle, show either create or upgrade CTA based on MHV account level.

    const { accountLevel } = this.props.mhvAccount;

    const redirectToTermsAndConditions = () => {
      const redirectQuery = { tc_redirect: window.location.pathname }; // eslint-disable-line camelcase
      const termsConditionsUrl = appendQuery(
        '/health-care/medical-information-terms-conditions/',
        redirectQuery,
      );
      window.location = termsConditionsUrl;
    };

    if (!accountLevel) {
      return {
        heading: `You’ll need to create a My HealtheVet account before you can ${
          this._serviceDescription
        }`,
        buttonText: 'Create a My HealtheVet Account',
        buttonHandler:
          accountState === 'needs_terms_acceptance'
            ? redirectToTermsAndConditions
            : this.props.createAndUpgradeMHVAccount,
        status: 'warning',
      };
    }

    return {
      heading: `You’ll need to upgrade your account before you can ${
        this._serviceDescription
      }`,
      buttonText: 'Upgrade Your Account',
      buttonHandler:
        accountState === 'needs_terms_acceptance'
          ? redirectToTermsAndConditions
          : this.props.upgradeMHVAccount,
      status: 'warning',
    };
  };

  getInaccessibleContent = () => {
    if (this.isHealthTool()) return this.getInaccessibleHealthContent();

    if (!this.props.verified) {
      return {
        heading: `Please verify your identity to ${this._serviceDescription}`,
        alertText: (
          <p>
            We take your privacy seriously, and we’re committed to protecting
            your information. You’ll need to verify your identity before we can
            give you access to your personal health information.
          </p>
        ),
        buttonText: 'Verify Your Identity',
        buttonHandler: verify,
        status: 'warning',
      };
    }

    // Generic error. Get actual copy later.
    return {
      heading: `You won’t be able to ${this._serviceDescription} right now`,
      alertText: (
        <div>
          <p>
            We’re sorry. Something went wrong on our end. You won’t be able to{' '}
            {this._serviceDescription} until we can figure out what’s wrong.
          </p>
          <h5>What you can do</h5>
          <p>
            You can try again later or call the VA.gov Help Desk at{' '}
            <a href="tel:855-574-7286">1-855-574-7286</a> (TTY:{' '}
            <a href="tel:18008778339">1-800-877-8339</a>
            ). We’re here Monday&#8211;Friday, 8:00 a.m.&#8211;8:00 p.m. (ET).
          </p>
        </div>
      ),
      status: 'error',
    };
  };

  isAccessible = () => {
    // Health tools will determine access based on MHV account levels
    // instead of services list until MHV account eligibility rules
    // no longer have to accommodate the pre-brand consolidation flow.

    if (this.isHealthTool()) {
      const { appId, mhvAccount } = this.props;

      switch (appId) {
        case 'health-records':
          return MHV_ACCOUNT_TYPES.includes(mhvAccount.accountLevel);
        case 'rx':
          return MHV_ACCOUNT_TYPES.slice(0, 2).includes(
            mhvAccount.accountLevel,
          );
        case 'messaging':
        case 'lab-and-test-results':
        case 'appointments':
          return mhvAccount.accountLevel === 'Premium';
        default:
          // Not a recognized health tool.
          return false;
      }
    }

    // We may only need to check whether the account is verified here and leave
    // leave the handling of access for other reasons to the apps after redirect.

    for (const requiredService of this._requiredServices) {
      if (!this.props.availableServices.has(requiredService)) return false;
    }

    return true;
  };

  isHealthTool = () => HEALTH_TOOLS.includes(this.props.appId);

  openLoginModal = () => this.props.toggleLoginModal(true);

  redirect = () => {
    if (this._redirectUrl.startsWith('/')) {
      window.location = this._redirectUrl;
    } else if (!this._popup) {
      this._popup = window.open(this._redirectUrl, 'redirect-popup');
      if (this._popup) this._popup.focus();
    }
  };

  render() {
    if (this.props.profile.loading || this.props.mhvAccount.loading) {
      return (
        <LoadingIndicator setFocus message="Loading your information..." />
      );
    }

    const {
      heading,
      alertText,
      buttonText,
      buttonHandler,
      status = 'info',
    } = this.getContent();

    const alertProps = {
      headline: heading,
      content: (
        <div className="usa-alert-text">
          {alertText}
          {buttonText && (
            <button className="usa-button-primary" onClick={buttonHandler}>
              {buttonText}
            </button>
          )}
        </div>
      ),
      status,
    };

    return <AlertBox isVisible {...alertProps} />;
  }
}

const mapStateToProps = state => {
  const profile = selectProfile(state);
  const { loading, mhvAccount, services } = profile;
  return {
    availableServices: new Set(services),
    isLoggedIn: isLoggedIn(state),
    profile: { loading },
    mhvAccount,
  };
};

const mapDispatchToProps = {
  createAndUpgradeMHVAccount,
  fetchMHVAccount,
  toggleLoginModal,
  upgradeMHVAccount,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CallToActionWidget);
