import React from 'react';
import appendQuery from 'append-query';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getIntroState } from 'platform/forms/save-in-progress/selectors';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { UNAUTH_SIGN_IN_DEFAULT_MESSAGE } from 'platform/forms-system/src/js/constants';
import featureFlagNames from 'platform/utilities/feature-toggles/featureFlagNames';

import { getAppData } from '../selectors';
import LoadingIndicator from './LoadingIndicator';
import { START_APPLICATION_TEXT } from '../constants';

function IntroductionLogin({
  isLoggedIn,
  isLOA3,
  isPersonalInfoFetchComplete,
  isPersonalInfoFetchFailed,
  route,
  showHideLoginModal,
  showMeb1990EMaintenanceAlert,
  user,
}) {
  const apiCallsComplete = isLOA3 === false || isPersonalInfoFetchComplete;

  const openLoginModal = () => {
    showHideLoginModal(true, 'cta-form');
  };

  const nextQuery = { next: window.location.pathname };
  const verifyUrl = appendQuery('/verify', nextQuery);
  const headlineText =
    'Save time—and save your work in progress—by signing in before starting your application. Make sure to use your sign-in information and not your sponsor’s.';
  const shouldShowLoadingIndicator =
    ((!isLoggedIn && !user?.login?.hasCheckedKeepAlive) || !apiCallsComplete) &&
    !isPersonalInfoFetchFailed &&
    !showMeb1990EMaintenanceAlert;
  const shouldShowMaintenanceAlert = showMeb1990EMaintenanceAlert;
  return (
    <>
      {shouldShowLoadingIndicator && <LoadingIndicator />}

      {(isLoggedIn || user?.login?.hasCheckedKeepAlive) && (
        <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--3">
          Begin your application for education benefits
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
            <p className="vads-u-margin-top--0">
              We’re currently making updates to the My Education Benefits
              platform. We apologize for the inconvenience. Please check back
              soon.
            </p>
          </div>
        </va-alert>
      )}

      {!isLoggedIn &&
        user?.login?.hasCheckedKeepAlive &&
        !shouldShowMaintenanceAlert && (
          <>
            <va-alert
              close-btn-aria-label="Close notification"
              status="continue"
              visible
            >
              <h2 slot="headline">{headlineText}</h2>
              <div>
                <p className="vads-u-margin-top--0">
                  When you’ve signed in to your verified VA.gov account:
                </p>
                <ul>
                  <li>
                    We can prefill part of your application based on your
                    account details.
                  </li>
                  <li>We may be able to give you an instant decision.</li>
                  <li>
                    You can save your application in progress, and come back
                    later to finish filling it out. You’ll have 60 days from the
                    date you start or update your application to submit it.
                    After 60 days we’ll delete the application and you’ll have
                    to start over.
                  </li>
                </ul>
                <p>
                  <strong>Note:</strong> If you sign in after you’ve started
                  your application, you won’t be able to save the information
                  you’ve already filled in.
                </p>

                <button
                  className="usa-button-primary"
                  onClick={openLoginModal}
                  type="button"
                >
                  {UNAUTH_SIGN_IN_DEFAULT_MESSAGE}
                </button>
              </div>
            </va-alert>
            <p className="vads-u-margin-top--4">
              If you don't want to sign in, you can{' '}
              <a href="https://www.va.gov/find-forms/about-form-22-1990e/">
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
            startText={START_APPLICATION_TEXT}
            user={user}
          />
        )}

      {apiCallsComplete &&
        isLoggedIn &&
        isLOA3 === false && (
          <va-alert
            close-btn-aria-label="Close notification"
            status="continue"
            visible
          >
            <h2 slot="headline">
              Verify your identity before starting your application
            </h2>
            <div>
              <p className="vads-u-margin-top--0">
                When you verify your VA.gov account:
              </p>
              <ul>
                <li>
                  We can prefill part of your application based on your account
                  details.
                </li>
                <li>We may be able to give you an instant decision.</li>
              </ul>
              <p>
                Verifying your VA.gov account is a one-time process that will
                take <strong>5-10 minutes</strong> to complete. Once your
                account is verified, you can continue to this application.
              </p>
              <p className="vads-u-margin-bottom--2p5">
                <a className="vads-c-action-link--green" href={verifyUrl}>
                  Verify your identity before starting your application
                </a>
              </p>
            </div>
          </va-alert>
        )}
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
  showMeb1990EMaintenanceAlert: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  ...getIntroState(state),
  ...getAppData(state),
  isPersonalInfoFetchFailed: state.data.isPersonalInfoFetchFailed || false,
  showMeb1990EMaintenanceAlert:
    state.featureToggles[featureFlagNames.showMeb1990EMaintenanceAlert],
});

const mapDispatchToProps = {
  showHideLoginModal: toggleLoginModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionLogin);
