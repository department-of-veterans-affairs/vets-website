// Node modules.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import appendQuery from 'append-query';
import { connect } from 'react-redux';
// Relative imports.
import recordEvent from '~/platform/monitoring/record-event';
import { fetchMHVAccount } from '~/platform/user/profile/actions';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import sessionStorage from '~/platform/utilities/storage/sessionStorage';
import { CSP_IDS, AUTH_EVENTS } from '~/platform/user/authentication/constants';
import {
  isAuthenticatedWithSSOe,
  signInServiceName,
} from '~/platform/user/authentication/selectors';
import { isLoggedIn, selectProfile } from '~/platform/user/selectors';
import {
  logout as IAMLogout,
  mfa,
} from '~/platform/user/authentication/utilities';
import { logoutUrlSiS } from '~/platform/utilities/oauth/utilities';
import { toggleLoginModal } from '~/platform/site-wide/user-nav/actions';
import MFA from './components/messages/DirectDeposit/MFA';
import ChangeAddress from './components/messages/ChangeAddress';
import DeactivatedMHVIds from './components/messages/DeactivatedMHVIds';
import DirectDeposit from './components/messages/DirectDeposit';
import DirectDepositUnAuthed from './components/messages/DirectDeposit/Unauthed';
import HealthToolsDown from './components/messages/HealthToolsDown';
import MultipleIds from './components/messages/MultipleIds';
import NeedsSSNResolution from './components/messages/NeedsSSNResolution';
import NoMHVAccount from './components/messages/NoMHVAccount';
import SignInOtherAccount from './components/messages/SignInOtherAccount';
import NotFound from './components/messages/mvi/NotFound';
import OpenMyHealtheVet from './components/messages/OpenMyHealtheVet';
import RegisterFailed from './components/messages/RegisterFailed';
import SignIn from './components/messages/SignIn';
import UpgradeAccount from './components/messages/UpgradeAccount';
import UpgradeFailed from './components/messages/UpgradeFailed';
import VAOnlineScheduling from './components/messages/VAOnlineScheduling';
import Verify from './components/messages/Verify';
import { ACCOUNT_STATES, ACCOUNT_STATES_SET } from './constants';
import { ctaWidgetsLookup, CTA_WIDGET_TYPES } from './ctaWidgets';

export class CallToActionWidget extends Component {
  constructor(props) {
    super(props);
    const { appId } = props;
    const ctaWidget = ctaWidgetsLookup?.[appId];

    this._popup = null;
    this._requiredServices = ctaWidget?.requiredServices;
    this._serviceDescription = ctaWidget?.serviceDescription;
    this._mhvToolName = ctaWidget?.mhvToolName;
    this._toolDetails = ctaWidget?.deriveToolUrlDetails() || {};
    this._toolUrl = null;
    this._gaPrefix = 'register-mhv';
    this._featureToggle = ctaWidget?.featureToggle;
    this._headerLevel = ctaWidget?.headerLevel || props.headerLevel;
    this._requiresVerification = ctaWidget?.requiresVerification;
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
      const { appId, authenticatedWithSSOe } = this.props;

      // Derive the CTA widget.
      const ctaWidget = ctaWidgetsLookup?.[appId];

      // Derive the url details.
      const toolURLDetails = ctaWidget?.deriveToolUrlDetails(
        authenticatedWithSSOe,
      );
      const url = toolURLDetails?.url;
      const redirect = toolURLDetails?.redirect;

      this._toolUrl = url;
      if (redirect && !this._popup) this.goToTool();
    }
    /*
      This is causing an infinite loop in production because the `v0/mhv_accounts` get request
      is returning a 404.

      else if (this.isHealthTool()) {
        const { accountState, loading } = this.props.mhvAccount;

        if (loading) return;

        if (!accountState) {
          this.props.fetchMHVAccount();
        } else if (
          new URLSearchParams(window.location.search).get('tc_accepted')
        ) {
          // Since T&C is still required to support the existing account states,
          // check the existence of a query param that gets appended after
          // successful T&C acceptance to complete account creation or upgrade.
          We are no longer creating or upgrading MHV accounts on VA.gov
        }
      }
    */
  }

  updateReturnUrl = () => {
    const { url, redirect } = this._toolDetails;
    if (url?.length > 0 && url?.startsWith('/') && redirect) {
      // fix the internal link
      sessionStorage.setItem(
        'authReturnUrl',
        `${window.location.origin}${url}`,
      );
    } else {
      sessionStorage.removeItem('authReturnUrl');
    }
  };

  getContent = () => {
    if (!this.props.isLoggedIn) {
      this.updateReturnUrl();
      if (this.props.appId === CTA_WIDGET_TYPES.DIRECT_DEPOSIT) {
        return (
          <DirectDepositUnAuthed
            primaryButtonHandler={this.openLoginModal}
            headerLevel={this._headerLevel}
            ariaLabel={this.props.ariaLabel}
            ariaDescribedby={this.props.ariaDescribedby}
          />
        );
      }
      return (
        <SignIn
          serviceDescription={this._serviceDescription}
          primaryButtonHandler={
            this._requiresVerification
              ? this.openForcedLoginModal
              : this.openLoginModal
          }
          headerLevel={this._headerLevel}
          ariaLabel={this.props.ariaLabel}
          ariaDescribedby={this.props.ariaDescribedby}
        />
      );
    }

    if (this.isHealthTool()) return this.getHealthToolContent();

    if (!this.props.profile.verified) {
      recordEvent({
        event: `${this._gaPrefix}-info-needs-identity-verification`,
      });

      return this.getVerifyAlert();
    }

    if (this.isNonMHVSchedulingTool()) {
      if (this.hasMVIError()) {
        return this.getMviErrorContent();
      }

      return <VAOnlineScheduling featureToggles={this.props.featureToggles} />;
    }

    if (this.props.appId === CTA_WIDGET_TYPES.DIRECT_DEPOSIT) {
      if (!this.props.profile.multifactor) {
        return <MFA />;
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

    if (this.props.appId === CTA_WIDGET_TYPES.CHANGE_ADDRESS) {
      return (
        <ChangeAddress
          featureToggles={this.props.featureToggles}
          serviceDescription={this._serviceDescription}
          primaryButtonHandler={this.goToTool}
        />
      );
    }

    return null;
  };

  // Function called when isHealthTool()
  getHealthToolContent = () => {
    const { mhvAccount, authenticatedWithSSOe } = this.props;

    if (this.hasMVIError()) {
      return this.getMviErrorContent();
    }

    if (authenticatedWithSSOe) {
      const errorContent = this.getInaccessibleHealthToolContentSSOe();
      if (errorContent) return errorContent;
      return (
        <OpenMyHealtheVet
          serviceDescription={this._serviceDescription}
          primaryButtonHandler={this.goToTool}
          toolName={this._mhvToolName}
        />
      );
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

    return this.getInaccessibleHealthToolContent();
  };

  // Function called when isHealthTool() or isNonMHVSchedulingTool()
  getMviErrorContent = () => {
    switch (this.props.mviStatus) {
      case 'NOT_AUTHORIZED':
        return this.getVerifyAlert();
      case 'NOT_FOUND':
        return <NotFound />;
      default:
        return <HealthToolsDown />;
    }
  };

  // Function called when isHealthTool() or isNonMHVSchedulingTool()
  getVerifyAlert = () => {
    const serviceDescription = this.isHealthTool()
      ? 'access more VA.gov tools and features'
      : this._serviceDescription;
    switch (this.props.serviceName) {
      case CSP_IDS.ID_ME:
      case CSP_IDS.LOGIN_GOV:
        return (
          <Verify
            signInService={this.props.serviceName}
            headerLevel={this._headerLevel}
            serviceDescription={serviceDescription}
          />
        );

      case CSP_IDS.MHV:
      default:
        return (
          <SignInOtherAccount
            headerLevel={this._headerLevel}
            serviceDescription={serviceDescription}
          />
        );
    }
  };

  // Function called when isHealthTool()
  getInaccessibleHealthToolContentSSOe = () => {
    const { profile, mhvAccountIdState } = this.props;

    if (!profile.verified) {
      recordEvent({
        event: `${this._gaPrefix}-info-needs-identity-verification`,
      });
      return this.getVerifyAlert();
    }
    if (mhvAccountIdState === 'DEACTIVATED') {
      recordEvent({ event: `${this._gaPrefix}-error-has-deactivated-mhv-ids` });
      return <DeactivatedMHVIds />;
    }

    return null;
  };

  sendToMHV = () => {
    window.location = mhvUrl(this.props.authenticatedWithSSOe, 'home');
  };

  // Function called when isHealthTool()
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
        return this.getVerifyAlert();

      case ACCOUNT_STATES.NEEDS_SSN_RESOLUTION:
        return <NeedsSSNResolution />;
      case ACCOUNT_STATES.DEACTIVATED_MHV_IDS:
        return <DeactivatedMHVIds />;

      case ACCOUNT_STATES.MULTIPLE_IDS:
        return <MultipleIds />;

      case ACCOUNT_STATES.REGISTER_FAILED:
        return <RegisterFailed />;

      case ACCOUNT_STATES.UPGRADE_FAILED:
        return <UpgradeFailed />;

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
              : this.sendToMHV
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
            : this.sendToMHV
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
    (this.props.appId === CTA_WIDGET_TYPES.SCHEDULE_APPOINTMENTS ||
      this.props.appId === CTA_WIDGET_TYPES.VIEW_APPOINTMENTS);

  isAccessible = () => {
    if (this.isHealthTool()) {
      // Until MHV account eligibility rules no longer have to accommodate the
      // pre-brand consolidation flow, the frontend will gate access using the MHV
      // account level instead of the available services list from the backend,
      // which will already have validated the MHV account level policies.
      const { appId, mhvAccount } = this.props;

      // Derive the CTA widget.
      const ctaWidget = ctaWidgetsLookup?.[appId];

      return ctaWidget?.hasRequiredMhvAccount(mhvAccount.accountLevel);
    }
    if (this.props.appId === CTA_WIDGET_TYPES.DIRECT_DEPOSIT) {
      // Direct Deposit requires multifactor
      return this.props.profile.verified && this.props.profile.multifactor;
    }

    // Only check whether the account is verified here and leave any handling
    // of gated access for other reasons to the apps after redirect.
    return this.props.profile.verified;
  };

  isHealthTool = () => {
    const { appId } = this.props;

    // Derive the CTA widget.
    const ctaWidget = ctaWidgetsLookup?.[appId];

    return !this.isNonMHVSchedulingTool() && ctaWidget?.isHealthTool;
  };

  openLoginModal = () => this.props.toggleLoginModal(true);

  openForcedLoginModal = () => this.props.toggleLoginModal(true, '', true);

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

  signOut = () => {
    recordEvent({ event: 'logout-link-clicked-createcta-mhv' });
    if (this.props.authenticatedWithSSOe) {
      IAMLogout();
    } else {
      window.location = logoutUrlSiS();
    }
  };

  mfaHandler = () => {
    recordEvent({ event: AUTH_EVENTS.MFA });
    mfa();
  };

  render() {
    const {
      appId,
      authenticatedWithSSOe,
      children,
      featureToggles,
      mhvAccount,
      profile,
      setFocus,
    } = this.props;

    // Show spinner if loading.
    if (profile.loading || mhvAccount.loading || featureToggles.loading) {
      return (
        <va-loading-indicator
          setFocus={setFocus}
          message="Loading your information..."
        />
      );
    }

    // Derive the CTA widget.
    const ctaWidget = ctaWidgetsLookup?.[appId];

    // Render nothing if feature toggle is off.
    if (!!this._featureToggle && !featureToggles[this._featureToggle]) {
      return null;
    }

    // Derive the CTA URL.
    const url = ctaWidget?.deriveToolUrlDetails(authenticatedWithSSOe)?.url;
    this._toolUrl = url;

    // Derive the content and show it if available.
    const content = this.getContent();
    if (content) return content;

    // Show the child nodes if provided.
    if (children) return children;

    // Derive anchor tag properties.
    const isInternalLink = this._toolUrl.startsWith('/');
    const target = isInternalLink ? '_self' : '_blank';
    const linkText = [
      this._serviceDescription[0].toUpperCase(),
      this._serviceDescription.slice(1),
    ].join('');

    // Show the CTA link.
    return (
      <a
        className="vads-c-action-link--green"
        href={this._toolUrl}
        target={target}
      >
        {linkText}
      </a>
    );
  }
}

CallToActionWidget.propTypes = {
  fetchMHVAccount: PropTypes.func.isRequired, // From mapDispatchToProps.
  toggleLoginModal: PropTypes.func.isRequired, // From mapDispatchToProps.
  appId: PropTypes.string, // Directly passed in props.
  ariaDescribedby: PropTypes.string, // From mapDispatchToProps.
  ariaLabel: PropTypes.string, // From mapDispatchToProps.
  authenticatedWithSSOe: PropTypes.bool, // From mapStateToProps.
  children: PropTypes.node, // Directly passed in props.
  featureToggles: PropTypes.object, // From mapStateToProps.
  headerLevel: PropTypes.string, // Directly passed in props.
  isLoggedIn: PropTypes.bool, // From mapStateToProps.
  isVaPatient: PropTypes.bool, // From mapStateToProps.
  mhvAccount: PropTypes.object, // From mapStateToProps.
  mhvAccountIdState: PropTypes.string, // From mapStateToProps.
  mviStatus: PropTypes.string, // From mapStateToProps.
  profile: PropTypes.object, // From mapStateToProps.
  serviceName: PropTypes.string, // From mapStateToProps.
  setFocus: PropTypes.bool, // Directly passed in props.
};

CallToActionWidget.defaultProps = {
  setFocus: true,
};

const mapStateToProps = state => {
  // Derive profile properties.
  const {
    loading,
    mhvAccount,
    mhvAccountState,
    multifactor,
    status,
    vaPatient,
    verified,
  } = selectProfile(state);

  return {
    authenticatedWithSSOe: isAuthenticatedWithSSOe(state),
    serviceName: signInServiceName(state),
    featureToggles: state.featureToggles,
    isLoggedIn: isLoggedIn(state),
    isVaPatient: vaPatient,
    mhvAccount,
    mhvAccountIdState: mhvAccountState,
    mviStatus: status,
    profile: { loading, verified, multifactor },
  };
};

const mapDispatchToProps = {
  fetchMHVAccount,
  toggleLoginModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CallToActionWidget);
