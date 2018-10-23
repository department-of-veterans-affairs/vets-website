import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import appendQuery from 'append-query';
import URLSearchParams from 'url-search-params';

import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';
import CallHelpDesk from '../../brand-consolidation/components/CallHelpDesk';

import { toggleLoginModal } from '../user-nav/actions';
import { verify } from '../../user/authentication/utilities';

import {
  createAndUpgradeMHVAccount,
  fetchMHVAccount,
  upgradeMHVAccount,
} from '../../user/profile/actions';

import { isLoggedIn, selectProfile } from '../../user/selectors';
import titleCase from '../../utilities/data/titleCase';

import CallToActionAlert from './CallToActionAlert';

import {
  hasRequiredMhvAccount,
  isHealthTool,
  mhvToolName,
  requiredServices,
  serviceDescription,
  toolUrl,
} from './helpers';

export class CallToActionWidget extends React.Component {
  constructor(props) {
    super(props);
    const { appId, index } = props;
    const { url, redirect } = toolUrl(appId, index);

    this._hasRedirect = redirect;
    this._isHealthTool = isHealthTool(appId);
    this._popup = null;
    this._requiredServices = requiredServices(appId);
    this._serviceDescription = serviceDescription(appId, index);
    this._mhvToolName = mhvToolName(appId);
    this._toolUrl = url;
  }

  componentDidMount() {
    if (this._isHealthTool && this.props.isLoggedIn) {
      this.props.fetchMHVAccount();
    }
  }

  componentDidUpdate() {
    if (!this.props.isLoggedIn) return;

    if (this.isAccessible()) {
      if (this._hasRedirect && !this._popup) this.goToTool();
    } else if (this._isHealthTool) {
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
    if (!this.props.isLoggedIn) {
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
        status: 'info',
      };
    }

    if (this._isHealthTool) return this.getHealthToolContent();

    if (!this.props.profile.verified) {
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

    return null;
  };

  getHealthToolContent = () => {
    if (this.isAccessible()) {
      return {
        heading: 'My HealtheVet will open in a new tab',
        alertText: (
          <p>
            You may need to sign in again on My HealtheVet before you can use
            the site’s {this._mhvToolName} tool. If you do, please sign in with
            the same account you used to sign in here on VA.gov. You also may
            need to disable your browser’s pop-up blocker so that My HealtheVet
            will be able to open.
          </p>
        ),
        buttonText: 'Go to My HealtheVet',
        buttonHandler: this.goToTool,
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
              You can try again later or{' '}
              <CallHelpDesk>
                call the VA.gov Help Desk at{' '}
                <a href="tel:855-574-7286">1-855-574-7286</a> (TTY:{' '}
                <a href="tel:18008778339">1-800-877-8339</a>
                ). We’re here Monday&#8211;Friday, 8:00 a.m.&#8211;8:00 p.m.
                (ET).
              </CallHelpDesk>
            </p>
          </div>
        ),
        status: 'error',
      };
    }

    return this.getInaccessibleHealthToolContent();
  };

  getInaccessibleHealthToolContent = () => {
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
                If you feel you’ve entered your information correctly, please{' '}
                <CallHelpDesk>
                  call the VA.gov Help Desk at{' '}
                  <a href="tel:855-574-7286">1-855-574-7286</a> (TTY:{' '}
                  <a href="tel:18008778339">1-800-877-8339</a>
                  ). We’re here Monday&#8211;Friday, 8:00 a.m.&#8211;8:00 p.m.
                  (ET).
                </CallHelpDesk>
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
                If you feel you’ve entered your information correctly, please{' '}
                <CallHelpDesk>
                  call the VA.gov Help Desk at{' '}
                  <a href="tel:855-574-7286">1-855-574-7286</a> (TTY:{' '}
                  <a href="tel:18008778339">1-800-877-8339</a>
                  ). We’re here Monday&#8211;Friday, 8:00 a.m.&#8211;8:00 p.m.
                  (ET).
                </CallHelpDesk>
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
                Please{' '}
                <CallHelpDesk>
                  call the VA.gov Help Desk at{' '}
                  <a href="tel:855-574-7286">1-855-574-7286</a> (TTY:{' '}
                  <a href="tel:18008778339">1-800-877-8339</a>
                  ). We’re here Monday&#8211;Friday, 8:00 a.m.&#8211;8:00 p.m.
                  (ET).
                </CallHelpDesk>
              </p>
            </div>
          ),
          status: 'error',
        };

      /* Handling for these states to be re-introduced after brand consolidation
       * when VA patient and T&C acceptance checks will no longer gate access, so
       * access to these tools will be accurately reported by the services list.
       * For now, MHV account level requirements will be validated client-side.
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
                You can try again later or{' '}
                <CallHelpDesk>
                  call the VA.gov Help Desk at{' '}
                  <a href="tel:855-574-7286">1-855-574-7286</a> (TTY:{' '}
                  <a href="tel:18008778339">1-800-877-8339</a>
                  ). We’re here Monday&#8211;Friday, 8:00 a.m.&#8211;8:00 p.m.
                  (ET).
                </CallHelpDesk>
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
                If you feel you’ve entered your information correctly, please{' '}
                <CallHelpDesk>
                  call the VA.gov Help Desk at{' '}
                  <a href="tel:855-574-7286">1-855-574-7286</a> (TTY:{' '}
                  <a href="tel:18008778339">1-800-877-8339</a>
                  ). We’re here Monday&#8211;Friday, 8:00 a.m.&#8211;8:00 p.m.
                  (ET).
                </CallHelpDesk>
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

  isAccessible = () => {
    if (this._isHealthTool) {
      // Until MHV account eligibility rules no longer have to accommodate the
      // pre-brand consolidation flow, the frontend will gate access using the MHV
      // account level instead of the available services list from the backend,
      // which will already have validated the MHV account level policies.
      const { appId, mhvAccount } = this.props;
      return hasRequiredMhvAccount(appId, mhvAccount.accountLevel);
      // return this.props.availableServices.has(this._requiredServices);
    }

    // Only check whether the account is verified here and leave any handling
    // of gated access for other reasons to the apps after redirect.
    return this.props.profile.verified;
  };

  openLoginModal = () => this.props.toggleLoginModal(true);

  goToTool = () => {
    const url = this._toolUrl;
    if (!url) return;

    if (url.startsWith('/')) {
      window.location = url;
    } else {
      this._popup = window.open(url, 'cta-popup');
      if (this._popup) this._popup.focus();
      else {
        // Indicate an attempted pop-up to avoid automatically showing a
        // pop-up later on a component update triggered by a state change.
        this._popup = true;
      }
    }
  };

  render() {
    if (this.props.profile.loading || this.props.mhvAccount.loading) {
      return (
        <LoadingIndicator setFocus message="Loading your information..." />
      );
    }

    const content = this.getContent();

    if (content) return <CallToActionAlert {...content} />;

    if (this.props.children) return this.props.children;

    const isInternalLink = this._toolUrl.startsWith('/');
    const buttonClass = isInternalLink
      ? classNames('usa-button-primary', 'va-button-primary')
      : '';
    const target = isInternalLink ? '_self' : '_blank';

    return (
      <a className={buttonClass} href={this._toolUrl} target={target}>
        {titleCase(this._serviceDescription)}
      </a>
    );
  }
}

const mapStateToProps = state => {
  const profile = selectProfile(state);
  const { loading, mhvAccount, /* services, */ verified } = profile;
  return {
    // availableServices: new Set(services),
    isLoggedIn: isLoggedIn(state),
    profile: { loading, verified },
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
