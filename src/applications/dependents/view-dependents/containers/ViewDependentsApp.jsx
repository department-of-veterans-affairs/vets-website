import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import backendServices from 'platform/user/profile/constants/backendServices';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import PropTypes from 'prop-types';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { RequiredLoginView } from 'platform/user/authorization/components/RequiredLoginView';
import titleCase from 'platform/utilities/data/titleCase';
import { useBrowserMonitoring } from 'platform/monitoring/Datadog/';

import { fetchAllDependents as fetchAllDependentsAction } from '../actions/index';
import { fetchRatingInfo as fetchRatingInfoAction } from '../actions/ratingInfo';
import ViewDependentsLayout from '../layouts/ViewDependentsLayout';
import ViewDependentsLayoutV2 from '../layouts/ViewDependentsLayoutV2';

import { PAGE_TITLE, TITLE_SUFFIX } from '../util';

/**
 * View Dependents App
 * @param {object} user - user object from Redux store
 * @param {boolean} loading - loading state
 * @param {object} error - error object
 * @param {array} onAwardDependents - dependents on award list
 * @param {array} notOnAwardDependents - dependents not on award list
 * @param {boolean} manageDependentsToggle - feature toggle for managing dependents
 * @param {boolean} dependentsVerificationFormToggle - feature toggle for dependents verification form
 * @param {boolean} updateDiariesStatus - status of updating diaries
 * @param {function} fetchAllDependents - action to fetch all dependents
 * @param {function} fetchRatingInfo - action to fetch rating information
 * @param {boolean} hasMinimumRating - whether the user has minimum rating
 * @param {boolean} isLoggedIn - user login status
 * @returns {React.JSX.Element} - rendered component
 */
const ViewDependentsApp = ({
  user,
  loading,
  error,
  onAwardDependents,
  notOnAwardDependents,
  manageDependentsToggle,
  dependentsVerificationFormToggle,
  updateDiariesStatus,
  fetchAllDependents,
  fetchRatingInfo,
  hasMinimumRating,
  isLoggedIn,
}) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const dependentsModuleEnabled = useToggleValue(
    TOGGLE_NAMES.dependentsModuleEnabled,
  );
  useEffect(() => {
    if (isLoggedIn) {
      fetchAllDependents(dependentsModuleEnabled);
      fetchRatingInfo();
    }
    document.title = `${titleCase(PAGE_TITLE)}${TITLE_SUFFIX}`;
  }, [
    fetchAllDependents,
    fetchRatingInfo,
    isLoggedIn,
    dependentsModuleEnabled,
  ]);

  // Add Datadog monitoring to the application
  useBrowserMonitoring({
    loggedIn: isLoggedIn,
    toggleName: 'vaDependentsViewBrowserMonitoringEnabled',
    applicationId: '7b9afdca-6bc0-4706-90c6-b111cf5c66c5',
    clientToken: 'pubbc32e28e73f69e1a445f98e2437c5ff9',
    version: '1.0.0',
    service: 'benefits-view-dependents',

    // Don't record any replay sessions; no need to see page interactions (yet)
    sessionReplaySampleRate: 0,
    sessionSampleRate: 100,
    trackBfcacheViews: true,
    defaultPrivacyLevel: 'mask-user-input',
  });

  const layout = dependentsVerificationFormToggle ? (
    <ViewDependentsLayoutV2
      loading={loading}
      error={error}
      onAwardDependents={onAwardDependents}
      notOnAwardDependents={notOnAwardDependents}
      manageDependentsToggle={manageDependentsToggle}
      updateDiariesStatus={updateDiariesStatus}
      hasMinimumRating={hasMinimumRating}
    />
  ) : (
    <ViewDependentsLayout
      loading={loading}
      error={error}
      onAwardDependents={onAwardDependents}
      notOnAwardDependents={notOnAwardDependents}
      manageDependentsToggle={manageDependentsToggle}
      updateDiariesStatus={updateDiariesStatus}
    />
  );
  return (
    <div className="row">
      <div className="usa-width-two-thirds medium-8 columns print-full-width">
        <DowntimeNotification
          appTitle="view dependents tool"
          dependencies={[
            externalServices.bgs,
            externalServices.global,
            externalServices.mvi,
            externalServices.vaProfile,
            externalServices.vbms,
          ]}
        >
          <RequiredLoginView
            serviceRequired={backendServices.USER_PROFILE}
            user={user}
          >
            {layout}
          </RequiredLoginView>
        </DowntimeNotification>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.user,
  loading:
    state.allDependents.loading ||
    state.ratingValue.loading ||
    state.featureToggles?.loading,
  error: state.allDependents.error || state.ratingValue.error,
  isLoggedIn: state.user?.login?.currentlyLoggedIn,
  manageDependentsToggle:
    toggleValues(state)[FEATURE_FLAG_NAMES.manageDependents],
  dependentsVerificationFormToggle:
    toggleValues(state)[FEATURE_FLAG_NAMES.vaDependentsVerification],
  onAwardDependents: state.allDependents.onAwardDependents,
  hasMinimumRating: state.ratingValue.hasMinimumRating,
  notOnAwardDependents: state.allDependents.notOnAwardDependents,
  updateDiariesStatus: state.verifyDependents.updateDiariesStatus,
});

const mapDispatchToProps = {
  fetchAllDependents: fetchAllDependentsAction,
  fetchRatingInfo: fetchRatingInfoAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewDependentsApp);

ViewDependentsApp.propTypes = {
  fetchAllDependents: PropTypes.func.isRequired,
  fetchRatingInfo: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  dependentsVerificationFormToggle: PropTypes.bool,
  error: PropTypes.object,
  hasMinimumRating: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  manageDependentsToggle: PropTypes.bool,
  notOnAwardDependents: PropTypes.array,
  updateDiariesStatus: PropTypes.bool,
  onAwardDependents: PropTypes.array,
};

export { ViewDependentsApp };
