import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getIntroState } from 'platform/forms/save-in-progress/selectors';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import VerifyAlert from 'platform/user/authorization/components/VerifyAlert';
import { UNAUTH_SIGN_IN_DEFAULT_MESSAGE } from 'platform/forms-system/src/js/constants';
import featureFlagNames from 'platform/utilities/feature-toggles/featureFlagNames';
import { getAppData } from '../selectors/selectors';
import LoadingIndicator from './LoadingIndicator';

function IntroductionLogin({
  isClaimantCallComplete,
  isPersonalInfoFetchFailed,
  isLoggedIn,
  isLOA3,
  route,
  showHideLoginModal,
  user,
  showMeb1990EZMaintenanceAlert,
  showMeb1990EZR6MaintenanceMessage,
  showMebEnhancements09, // Add showMebEnhancements09 as a prop
}) {
  const apiCallsComplete = isLOA3 === false || isClaimantCallComplete;
  const openLoginModal = () => {
    showHideLoginModal(true, 'cta-form', true);
  };

  // If showMebEnhancements09 is false and the user is not logged in or the API calls have not completed, then show the loading indicator
  const shouldShowLoadingIndicator =
    !showMebEnhancements09 &&
    ((!isLoggedIn && !user?.login?.hasCheckedKeepAlive) || !apiCallsComplete);
  const shouldShowMaintenanceAlert = showMeb1990EZMaintenanceAlert;
  let maintenanceMessage;
  if (showMeb1990EZR6MaintenanceMessage) {
    // Message for the R6 maintenance period
    maintenanceMessage =
      'We’re currently making updates to the My Education Benefits platform. We apologize for the inconvenience. Please check back soon.';
  } else if (shouldShowMaintenanceAlert) {
    // General maintenance message
    maintenanceMessage =
      'We are currently performing system updates. Please come back after 6:00 a.m. ET on Monday, July 28 when the application will be back up and running. Thank you for your patience while we continue improving our systems to provide faster, more convenient service to GI Bill beneficiaries.';
  }
  return (
    <>
      {shouldShowLoadingIndicator && <LoadingIndicator />}
      {(isLoggedIn || user?.login?.hasCheckedKeepAlive) && (
        <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--3">
          Begin your application for education benefits
        </h2>
      )}
      {shouldShowLoadingIndicator && <LoadingIndicator />}

      {(isPersonalInfoFetchFailed || shouldShowMaintenanceAlert) && (
        <va-alert
          close-btn-aria-label="Close notification"
          status="error"
          visible
        >
          <h2 slot="headline">System Maintenance</h2>
          <div>
            <p className="vads-u-margin-top--0">{maintenanceMessage}</p>
          </div>
        </va-alert>
      )}
      {!isLoggedIn &&
        user?.login?.hasCheckedKeepAlive && (
          <>
            <va-alert-sign-in
              variant="signInOptional"
              time-limit="60 days"
              visible
              heading-level={2}
            >
              <span slot="SignInButton">
                <va-button
                  text={UNAUTH_SIGN_IN_DEFAULT_MESSAGE}
                  onClick={openLoginModal}
                />
              </span>
            </va-alert-sign-in>
            <p className="vads-u-margin-top--4">
              <>
                If you don't want to sign in, you can{' '}
                <a href="https://www.va.gov/find-forms/about-form-22-1990/">
                  apply using the paper form
                </a>
                . Please expect longer processing time for decisions when opting
                for this method.
              </>
            </p>
          </>
        )}
      {isLoggedIn &&
        isPersonalInfoFetchFailed === false &&
        shouldShowMaintenanceAlert === false &&
        ((!showMebEnhancements09 && apiCallsComplete && isLOA3) ||
          (showMebEnhancements09 && isLOA3)) && (
          <SaveInProgressIntro
            headingLevel={
              2 // Ensure the error didn't occur. // Ensure the mainenance flag is not on.
            }
            hideUnauthedStartLink
            messages={route?.formConfig.savedFormMessages}
            pageList={route.pageList}
            prefillEnabled={route?.formConfig?.prefillEnabled}
            startText="Start your application"
            user={user}
          />
        )}
      {apiCallsComplete &&
        isLoggedIn &&
        isLOA3 === false && <VerifyAlert headingLevel={2} />}
    </>
  );
}
IntroductionLogin.propTypes = {
  route: PropTypes.object.isRequired,
  isClaimantCallComplete: PropTypes.bool,
  isLOA3: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  isPersonalInfoFetchFailed: PropTypes.bool,
  showHideLoginModal: PropTypes.func,
  showMeb1990EZMaintenanceAlert: PropTypes.bool,
  showMeb1990EZR6MaintenanceAlert: PropTypes.bool,
  showMeb1990EZR6MaintenanceMessage: PropTypes.bool,
  showMebEnhancements06: PropTypes.bool, // Add showMebEnhancements06 to propTypes
  showMebEnhancements09: PropTypes.bool, // Added new feature flag to propTypes
  user: PropTypes.object,
};
const mapStateToProps = state => ({
  ...getIntroState(state),
  ...getAppData(state),
  isPersonalInfoFetchFailed: state.data.isPersonalInfoFetchFailed || false,
  showMebEnhancements09:
    state.featureToggles[featureFlagNames.showMebEnhancements09], // Added new feature flag to mapStateToProps
  showMeb1990EZMaintenanceAlert:
    state.featureToggles[featureFlagNames.showMeb1990EZMaintenanceAlert],
  showMeb1990EZR6MaintenanceMessage:
    state.featureToggles[featureFlagNames.showMeb1990EZR6MaintenanceMessage],
});
const mapDispatchToProps = {
  showHideLoginModal: toggleLoginModal,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionLogin);
