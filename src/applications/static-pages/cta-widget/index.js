// Node modules.
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import environment from '~/platform/utilities/environment';
import recordEvent from '~/platform/monitoring/record-event';
import { fetchMHVAccount } from '~/platform/user/profile/actions';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import sessionStorage from '~/platform/utilities/storage/sessionStorage';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import {
  isAuthenticatedWithSSOe,
  signInServiceName,
} from '~/platform/user/authentication/selectors';
import { isLoggedIn, selectProfile } from '~/platform/user/selectors';
import { logout as IAMLogout } from '~/platform/user/authentication/utilities';
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

export const goToTool = (url, gaEvent) => {
  if (!url) return false;
  // Optionally push Google-Analytics event.
  if (gaEvent) {
    recordEvent(gaEvent);
  }
  if (url.startsWith('/')) {
    window.location = url;
    return false;
  }
  const newWindow = window.open(url, 'cta-popup');
  if (newWindow) {
    newWindow.focus();
    return false;
  }
  return true;
};

const updateReturnUrl = (url, redirect) => {
  if (url?.length > 0 && url?.startsWith('/') && redirect) {
    // fix the internal link
    sessionStorage.setItem('authReturnUrl', `${window.location.origin}${url}`);
  } else {
    sessionStorage.removeItem('authReturnUrl');
  }
};

export const sendToMHV = authenticatedWithSSOe => () => {
  window.location = mhvUrl(authenticatedWithSSOe, 'home');
};

export const signOut = authenticatedWithSSOe => () => {
  recordEvent({ event: 'logout-link-clicked-createcta-mhv' });
  if (authenticatedWithSSOe) {
    IAMLogout();
  } else {
    window.location = logoutUrlSiS();
  }
};

export const toggleModalWrapper = toggleModalFunc => ({
  openLoginModal: () => toggleModalFunc(true),
  openForcedLoginModal: () => toggleModalFunc(true, '', true),
});

export const goToToolWrapper = (url, knownEvent) => {
  if (knownEvent)
    return () => {
      goToTool(url, knownEvent);
    };
  return unknownEvent => {
    goToTool(url, unknownEvent);
  };
};

export const CallToActionWidget = ({
  appId,
  ariaDescribedby,
  ariaLabel,
  authenticatedWithSSOe,
  children,
  featureToggles,
  fetchMHVAccount: propsFetchMHVAccount,
  headerLevel: propsHeaderLevel,
  isLoggedIn: propsIsLoggedIn,
  mhvAccount,
  mhvAccountIdState,
  mviStatus,
  profile,
  serviceName,
  setFocus = true,
  toggleLoginModal: propsToggleLoginModal,
}) => {
  const isProduction = environment.isProduction() && !environment.isTest();
  const ctaWidget = ctaWidgetsLookup?.[appId];
  const featureToggle = ctaWidget?.featureToggle;
  const gaPrefix = 'register-mhv';
  const headerLevel = ctaWidget?.headerLevel || propsHeaderLevel;
  const mhvToolName = ctaWidget?.mhvToolName;
  const requiresVerification = ctaWidget?.requiresVerification;
  const serviceDescription = ctaWidget?.serviceDescription;
  const toolDetails = ctaWidget?.deriveToolUrlDetails(authenticatedWithSSOe);
  const url = toolDetails?.url;
  const redirect = toolDetails?.redirect;
  const isNonMHVSchedulingTool =
    featureToggles.vaOnlineScheduling &&
    (appId === CTA_WIDGET_TYPES.SCHEDULE_APPOINTMENTS ||
      appId === CTA_WIDGET_TYPES.VIEW_APPOINTMENTS);
  const isHealthTool = !isNonMHVSchedulingTool && ctaWidget?.isHealthTool;
  const healthToolDescription = isHealthTool
    ? 'access more VA.gov tools and features'
    : serviceDescription;
  const verifyAlert =
    serviceName === CSP_IDS.ID_ME || serviceName === CSP_IDS.LOGIN_GOV ? (
      <Verify
        signInService={serviceName}
        headerLevel={headerLevel}
        serviceDescription={healthToolDescription}
      />
    ) : (
      <SignInOtherAccount
        headerLevel={headerLevel}
        serviceDescription={healthToolDescription}
      />
    );
  const mviErrorContent = {
    SERVER_ERROR: <HealthToolsDown />,
    NOT_AUTHORIZED: verifyAlert,
    NOT_FOUND: <NotFound />,
  }[mviStatus];
  const hasRequiredMhvAccount = ctaWidget?.hasRequiredMhvAccount(
    mhvAccount.accountLevel,
  );
  const isDirectDeposit = appId === CTA_WIDGET_TYPES.DIRECT_DEPOSIT;
  const verifiedProfile = profile.verified;
  const multifactorProfile = verifiedProfile && profile.multifactor;
  const isAccessible = (() => {
    if (isHealthTool) return hasRequiredMhvAccount;
    if (isDirectDeposit) return multifactorProfile;
    return verifiedProfile;
  })();
  const loadingToggled = featureToggles.loading;

  const [popup, setPopup] = useState(false);
  const mounted = useRef();

  useEffect(
    () => {
      if (!mounted.current) {
        if (!loadingToggled && propsIsLoggedIn && isHealthTool) {
          propsFetchMHVAccount();
        }
        mounted.current = true;
      } else if (
        propsIsLoggedIn &&
        !loadingToggled &&
        isAccessible &&
        redirect &&
        !popup &&
        goToTool(url)
      ) {
        setPopup(true);
      }
    },
    [
      appId,
      authenticatedWithSSOe,
      ctaWidget,
      featureToggles,
      propsFetchMHVAccount,
      propsIsLoggedIn,
      mhvAccount,
      popup,
      profile,
      toolDetails,
      redirect,
      url,
      isHealthTool,
      isAccessible,
      loadingToggled,
    ],
  );

  // Show spinner if loading.
  if (profile.loading || mhvAccount.loading || loadingToggled) {
    return (
      <va-loading-indicator
        setFocus={setFocus}
        message="Loading your information..."
      />
    );
  }

  // Render nothing if feature toggle is off.
  if (featureToggle && !featureToggles[featureToggle]) {
    return null;
  }

  // Decide which content (if any) to render
  const content = (() => {
    if (!propsIsLoggedIn) {
      const { openLoginModal, openForcedLoginModal } = toggleModalWrapper(
        propsToggleLoginModal,
      );
      updateReturnUrl(url, redirect);
      if (isDirectDeposit) {
        return (
          <DirectDepositUnAuthed
            primaryButtonHandler={openLoginModal}
            headerLevel={headerLevel}
            ariaLabel={ariaLabel}
            ariaDescribedby={ariaDescribedby}
          />
        );
      }
      return (
        <SignIn
          serviceDescription={serviceDescription}
          primaryButtonHandler={
            requiresVerification ? openForcedLoginModal : openLoginModal
          }
          headerLevel={headerLevel}
          ariaLabel={ariaLabel}
          ariaDescribedby={ariaDescribedby}
        />
      );
    }

    const goToToolCallback = goToToolWrapper(url);

    if (isHealthTool) {
      if (mviErrorContent) return mviErrorContent;

      if (authenticatedWithSSOe) {
        const errorContent = (() => {
          if (!verifiedProfile) {
            if (isProduction) {
              recordEvent({
                event: `${gaPrefix}-info-needs-identity-verification`,
              });
            }
            return verifyAlert;
          }
          if (mhvAccountIdState === 'DEACTIVATED') {
            recordEvent({
              event: `${gaPrefix}-error-has-deactivated-mhv-ids`,
            });
            return <DeactivatedMHVIds />;
          }
          return null;
        })();
        return (
          errorContent || (
            <OpenMyHealtheVet
              serviceDescription={serviceDescription}
              primaryButtonHandler={goToToolCallback}
              toolName={mhvToolName}
            />
          )
        );
      }

      if (isAccessible) {
        return (
          <OpenMyHealtheVet
            serviceDescription={serviceDescription}
            primaryButtonHandler={goToToolCallback}
            toolName={mhvToolName}
          />
        );
      }

      if (mhvAccount.errors) {
        recordEvent({ event: `${gaPrefix}-error-mhv-down` });
        return <HealthToolsDown />;
      }

      const { accountState, accountLevel } = mhvAccount;

      // If valid account error state, record GA event
      if (accountState && ACCOUNT_STATES_SET.has(accountState)) {
        recordEvent({
          event: `${gaPrefix}-${
            accountState === ACCOUNT_STATES.NEEDS_VERIFICATION ||
            accountState === ACCOUNT_STATES.NEEDS_TERMS_ACCEPTANCE
              ? 'info'
              : 'error'
          }-${accountState.replace(/_/g, '-')}`,
        });
      }

      switch (accountState) {
        case ACCOUNT_STATES.NEEDS_VERIFICATION:
          return verifyAlert;

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

      const sendToMHVCallback = sendToMHV(authenticatedWithSSOe);
      // If account creation or upgrade isn't blocked by any of the errors we
      // handle, show either create or upgrade CTA based on MHV account level.
      if (!accountLevel) {
        return (
          <NoMHVAccount
            serviceDescription={serviceDescription}
            primaryButtonHandler={sendToMHVCallback}
            secondaryButtonHandler={signOut(authenticatedWithSSOe)}
          />
        );
      }

      return (
        <UpgradeAccount
          serviceDescription={serviceDescription}
          primaryButtonHandler={sendToMHVCallback}
        />
      );
    }

    if (!verifiedProfile) {
      if (isProduction) {
        recordEvent({
          event: `${gaPrefix}-info-needs-identity-verification`,
        });
      }
      return verifyAlert;
    }

    if (isNonMHVSchedulingTool) {
      if (mviErrorContent) {
        return mviErrorContent;
      }
      return <VAOnlineScheduling featureToggles={featureToggles} />;
    }

    if (isDirectDeposit) {
      if (!profile.multifactor) {
        return <MFA />;
      }
      return (
        <DirectDeposit
          serviceDescription={serviceDescription}
          primaryButtonHandler={goToToolWrapper(url, {
            event: 'nav-user-profile-cta',
          })}
        />
      );
    }

    if (appId === CTA_WIDGET_TYPES.CHANGE_ADDRESS) {
      return (
        <ChangeAddress
          featureToggles={featureToggles}
          serviceDescription={serviceDescription}
          primaryButtonHandler={goToToolCallback}
        />
      );
    }

    return null;
  })();

  if (content) return content;

  // Show the child nodes if provided.
  if (children) return children;

  // Derive anchor tag properties.
  const isInternalLink = url?.startsWith('/');
  const target = isInternalLink ? '_self' : '_blank';
  const linkText = [
    serviceDescription[0].toUpperCase(),
    serviceDescription.slice(1),
  ].join('');

  // Show the CTA link.
  return (
    <a className="vads-c-action-link--green" href={url} target={target}>
      {linkText}
    </a>
  );
};

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

export const mapStateToProps = state => {
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
