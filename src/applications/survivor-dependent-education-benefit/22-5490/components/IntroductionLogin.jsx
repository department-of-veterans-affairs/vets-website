import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getIntroState } from 'platform/forms/save-in-progress/selectors';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import VerifyAlert from 'platform/user/authorization/components/VerifyAlert';
import { UNAUTH_SIGN_IN_DEFAULT_MESSAGE } from 'platform/forms-system/src/js/constants';
import featureFlagNames from 'platform/utilities/feature-toggles/featureFlagNames';

import { getAppData } from '../selectors';
import LoadingIndicator from './LoadingIndicator';

function IntroductionLogin({
  isLoggedIn,
  isLOA3,
  isPersonalInfoFetchComplete,
  isPersonalInfoFetchFailed,
  route,
  showHideLoginModal,
  showMeb5490MaintenanceAlert,
  user,
}) {
  const apiCallsComplete = isLOA3 === false || isPersonalInfoFetchComplete;

  const openLoginModal = () => {
    showHideLoginModal(true, 'cta-form', true);
  };

  const shouldShowLoadingIndicator =
    ((!isLoggedIn && !user?.login?.hasCheckedKeepAlive) || !apiCallsComplete) &&
    !isPersonalInfoFetchFailed &&
    !showMeb5490MaintenanceAlert;
  const shouldShowMaintenanceAlert = showMeb5490MaintenanceAlert;
  let maintenanceMessage;
  if (shouldShowMaintenanceAlert) {
    // General maintenance message
    maintenanceMessage =
      'We’re currently making updates to the My Education Benefits platform. We apologize for the inconvenience. Please check back soon.';
  }
  return (
    <>
      {shouldShowLoadingIndicator && <LoadingIndicator />}

      {(isLoggedIn || user?.login?.hasCheckedKeepAlive) && (
        <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--3">
          Start your application for benefits
        </h2>
      )}

      {shouldShowLoadingIndicator && <LoadingIndicator />}

      {shouldShowMaintenanceAlert && (
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
              variant="signInRequired"
              time-limit="60 days"
              heading-level={2}
              visible
            >
              <span slot="SignInButton">
                <va-button
                  onClick={openLoginModal}
                  text={UNAUTH_SIGN_IN_DEFAULT_MESSAGE}
                />
              </span>
            </va-alert-sign-in>
            <p className="vads-u-margin-top--4">
              If you don't want to sign in, you can{' '}
              <a
                target="_blank"
                href="https://www.vba.va.gov/pubs/forms/VBA-22-5490-ARE.pdf"
                rel="noreferrer"
              >
                apply using the paper form
              </a>
              . Please expect longer processing time for decisions when opting
              for this method.
            </p>
          </>
        )}
      {isLoggedIn &&
        apiCallsComplete &&
        !shouldShowMaintenanceAlert &&
        isLOA3 && (
          <SaveInProgressIntro
            headingLevel={2}
            hideUnauthedStartLink
            messages={route?.formConfig.savedFormMessages}
            pageList={route.pageList}
            prefillEnabled={route?.formConfig?.prefillEnabled}
            startText="Start your benefits application"
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
  eligibility: PropTypes.arrayOf(PropTypes.string),
  isLOA3: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  isPersonalInfoFetchComplete: PropTypes.bool,
  isPersonalInfoFetchFailed: PropTypes.bool,
  showHideLoginModal: PropTypes.func,
  showMeb5490MaintenanceAlert: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  ...getIntroState(state),
  ...getAppData(state),
  isPersonalInfoFetchFailed: state.data.isPersonalInfoFetchFailed || false,
  showMeb5490MaintenanceAlert:
    state.featureToggles[featureFlagNames.showMeb5490MaintenanceAlert],
});

const mapDispatchToProps = {
  showHideLoginModal: toggleLoginModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionLogin);
