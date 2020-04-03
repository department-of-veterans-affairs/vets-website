import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import appendQuery from 'append-query';
import URLSearchParams from 'url-search-params';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { ssoe } from 'platform/user/authentication/selectors';
import { logout, verify, mfa } from 'platform/user/authentication/utilities';
import recordEvent from 'platform/monitoring/record-event';
import {
  ACCOUNT_STATES,
  ACCOUNT_STATES_SET,
} from 'applications/validate-mhv-account/constants';

import {
  createAndUpgradeMHVAccount,
  fetchMHVAccount,
  upgradeMHVAccount,
} from 'platform/user/profile/actions';

import { isLoggedIn, selectProfile } from 'platform/user/selectors';
import titleCase from 'platform/utilities/data/titleCase';

import {
  widgetTypes,
  hasRequiredMhvAccount,
  isHealthTool,
  mhvToolName,
  requiredServices,
  serviceDescription,
  toolUrl,
} from './helpers';

import HealthToolsDown from './components/messages/HealthToolsDown';
import SignIn from './components/messages/SignIn';
import Verify from './components/messages/Verify';
import OpenMyHealtheVet from './components/messages/OpenMyHealtheVet';
import MFA from './components/messages/MFA';
import DirectDeposit from './components/messages/DirectDeposit';
import NotAuthorized from './components/messages/mvi/NotAuthorized';
import NotFound from './components/messages/mvi/NotFound';
import NeedsSSNResolution from './components/messages/NeedsSSNResolution';
import DeactivatedMHVIds from './components/messages/DeactivatedMHVIds';
import MultipleIds from './components/messages/MultipleIds';
import RegisterFailed from './components/messages/RegisterFailed';
import UpgradeFailed from './components/messages/UpgradeFailed';
import NeedsVAPatient from './components/messages/NeedsVAPatient';
import NoMHVAccount from './components/messages/NoMHVAccount';
import UpgradeAccount from './components/messages/UpgradeAccount';
import VAOnlineScheduling from './components/messages/VAOnlineScheduling';

export class CallToActionWidget extends React.Component {
  constructor(props) {
    super(props);
    const { appId } = props;
    const { url, redirect } = toolUrl(appId);

    this._hasRedirect = redirect;
    this._popup = null;
    this._requiredServices = requiredServices(appId);
    this._serviceDescription = serviceDescription(appId);
    this._mhvToolName = mhvToolName(appId);
    this._toolUrl = url;
    this._gaPrefix = 'register-mhv';
  }

  componentDidMount() {
    if (
      !this.props.featureToggles.loading &&
      this.props.isLoggedIn &&
      this.isHealthTool()
    ) {
      this.props.fetchMHVAccount();
    }
  }

  componentDidUpdate() {
    if (!this.props.isLoggedIn || this.props.featureToggles.loading) {
      return;
    }

    if (this.isAccessible()) {
      if (this._hasRedirect && !this._popup) this.goToTool();
    } else if (this.isHealthTool()) {
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
      return (
        <SignIn
          serviceDescription={this._serviceDescription}
          primaryButtonHandler={this.openLoginModal}
        />
      );
    }

    if (this.isHealthTool()) return this.getHealthToolContent();

    if (!this.props.profile.verified) {
      recordEvent({
        event: `${this._gaPrefix}-info-needs-identity-verification`,
      });
      return (
        <Verify
          serviceDescription={this._serviceDescription}
          primaryButtonHandler={this.verifyHandler}
        />
      );
    }

    if (this.isNonMHVSchedulingTool()) {
      if (this.hasMVIError()) {
        return this.getMviErrorContent();
      }

      return (
        <VAOnlineScheduling
          appId={this.props.appId}
          isCommunityCareEnabled={
            this.props.featureToggles.vaOnlineSchedulingCommunityCare
          }
        />
      );
    }

    return null;
  };

  getHealthToolContent = () => {
    const { appId, mhvAccount, profile } = this.props;

    if (this.hasMVIError()) {
      return this.getMviErrorContent();
    }

    if (this.isAccessible()) {
      return (
        <OpenMyHealtheVet
          serviceDescription={this._serviceDescription}
          primaryButtonHandler={this.goToTool}
          toolName={this._mhvToolName}
        />
      );
    }

    if (mhvAccount.errors) {
      recordEvent({ event: `${this._gaPrefix}-error-mhv-down` });
      return <HealthToolsDown />;
    }

    if (profile.verified && appId === widgetTypes.DIRECT_DEPOSIT) {
      if (!profile.multifactor) {
        return (
          <MFA
            serviceDescription={this._serviceDescription}
            primaryButtonHandler={this.mfaHandler}
          />
        );
      }

      return (
        <DirectDeposit
          serviceDescription={this._serviceDescription}
          primaryButtonHandler={() =>
            this.goToTool({
              event: 'nav-user-profile-cta',
            })
          }
        />
      );
    }

    return this.getInaccessibleHealthToolContent();
  };

  getMviErrorContent = () => {
    switch (this.props.mviStatus) {
      case 'NOT_AUTHORIZED':
        return <NotAuthorized useSSOe={this.props.useSSOe} />;
      case 'NOT_FOUND':
        return <NotFound />;
      default:
        return <HealthToolsDown />;
    }
  };

  getInaccessibleHealthToolContent = () => {
    const { accountState } = this.props.mhvAccount;

    // If valid account error state, record GA event
    if (accountState && ACCOUNT_STATES_SET.has(accountState)) {
      recordEvent({
        event: `${this._gaPrefix}-${
          accountState === ACCOUNT_STATES.NEEDS_VERIFICATION ||
          accountState === ACCOUNT_STATES.NEEDS_TERMS_ACCEPTANCE
            ? 'info'
            : 'error'
        }-${accountState.replace(/_/g, '-')}`,
      });
    }

    switch (accountState) {
      case ACCOUNT_STATES.NEEDS_VERIFICATION:
        return (
          <Verify
            serviceDescription={this._serviceDescription}
            primaryButtonHandler={this.verifyHandler}
          />
        );

      case ACCOUNT_STATES.NEEDS_SSN_RESOLUTION:
        return <NeedsSSNResolution />;
      case ACCOUNT_STATES.DEACTIVATED_MHV_IDS:
        return <DeactivatedMHVIds />;

      case ACCOUNT_STATES.MULTIPLE_IDS:
        return <MultipleIds />;

      /* Handling for these states to be re-introduced after brand consolidation
       * when VA patient and T&C acceptance checks will no longer gate access, so
       * access to these tools will be accurately reported by the services list.
       * For now, MHV account level requirements will be validated client-side.
       *
       * case 'no_account':
       *   return {
       *     heading: `You’ll need to create a My HealtheVet account before you can ${this._serviceDescription`,
       *     primaryButtonText: 'Create a My HealtheVet Account',
       *     primaryButtonHandler: this.props.createAndUpgradeMHVAccount,
       *     status: 'continue'
       *   };

       * case 'existing':
       * case 'registered':
       *   return {
       *     heading: `You’ll need to upgrade your account before you can ${this._serviceDescription}`,
       *     primaryButtonText: 'Upgrade Your Account',
       *     primaryButtonHandler: this.props.upgradeMHVAccount,
       *     status: 'continue'
       *   };
       */

      case ACCOUNT_STATES.REGISTER_FAILED:
        return (
          <RegisterFailed
            createAndUpgradeMHVAccount={this.props.createAndUpgradeMHVAccount}
          />
        );

      case ACCOUNT_STATES.UPGRADE_FAILED:
        return (
          <UpgradeFailed upgradeMHVAccount={this.props.upgradeMHVAccount} />
        );

      case ACCOUNT_STATES.NEEDS_VA_PATIENT:
        return <NeedsVAPatient />;

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
      return (
        <NoMHVAccount
          serviceDescription={this._serviceDescription}
          primaryButtonHandler={
            accountState === 'needs_terms_acceptance'
              ? redirectToTermsAndConditions
              : this.props.createAndUpgradeMHVAccount
          }
          secondaryButtonHandler={this.signOut}
        />
      );
    }

    return (
      <UpgradeAccount
        serviceDescription={this._serviceDescription}
        primaryButtonHandler={
          accountState === 'needs_terms_acceptance'
            ? redirectToTermsAndConditions
            : this.props.upgradeMHVAccount
        }
      />
    );
  };

  hasMVIError = () => {
    const MviErrorStatuses = ['SERVER_ERROR', 'NOT_FOUND', 'NOT_AUTHORIZED'];

    return MviErrorStatuses.includes(this.props.mviStatus);
  };

  isNonMHVSchedulingTool = () =>
    this.props.featureToggles.vaOnlineScheduling &&
    (this.props.appId === widgetTypes.SCHEDULE_APPOINTMENTS ||
      this.props.appId === widgetTypes.VIEW_APPOINTMENTS);

  isAccessible = () => {
    if (this.isHealthTool()) {
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

  isHealthTool = () =>
    !this.isNonMHVSchedulingTool() && isHealthTool(this.props.appId);

  openLoginModal = () => this.props.toggleLoginModal(true);

  goToTool = gaEvent => {
    const url = this._toolUrl;
    if (!url) return;

    // Optionally push Google-Analytics event.
    if (gaEvent) {
      recordEvent(gaEvent);
    }

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

  authVersion() {
    return this.props.useSSOe ? 'v1' : 'v0';
  }

  signOut = () => {
    recordEvent({ event: 'logout-link-clicked-createcta-mhv' });
    logout(this.authVersion());
  };

  mfaHandler = () => {
    recordEvent({ event: 'multifactor-link-clicked' });
    mfa(this.authVersion());
  };

  verifyHandler = () => {
    verify(this.authVersion());
  };

  render() {
    const { setFocus } = this.props;
    if (
      this.props.profile.loading ||
      this.props.mhvAccount.loading ||
      this.props.featureToggles.loading
    ) {
      return (
        <LoadingIndicator
          setFocus={setFocus}
          message="Loading your information..."
        />
      );
    }

    const content = this.getContent();

    if (content) return content;

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
CallToActionWidget.defaultProps = {
  setFocus: true,
};

const mapStateToProps = state => {
  const profile = selectProfile(state);
  const {
    loading,
    mhvAccount,
    /* services, */
    verified,
    multifactor,
    status,
  } = profile;
  return {
    // availableServices: new Set(services),
    isLoggedIn: isLoggedIn(state),
    profile: { loading, verified, multifactor },
    mhvAccount,
    mviStatus: status,
    featureToggles: state.featureToggles,
    useSSOe: ssoe(state),
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
