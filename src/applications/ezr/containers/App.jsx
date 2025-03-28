import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { isLOA3, selectProfile } from 'platform/user/selectors';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { setData } from 'platform/forms-system/src/js/actions';

import { fetchEnrollmentStatus as fetchEnrollmentStatusAction } from '../utils/actions/enrollment-status';
import { selectAuthStatus } from '../utils/selectors/auth-status';
import { selectEnrollmentStatus } from '../utils/selectors/entrollment-status';
import { useBrowserMonitoring } from '../hooks/useBrowserMonitoring';
import { parseVeteranDob, parseVeteranGender } from '../utils/helpers/general';
import content from '../locales/en/content.json';
import formConfig from '../config/form';

// Define required services using backendServices
const REQUIRED_BACKEND_SERVICES = [
  backendServices.USER_PROFILE,
  backendServices.FACILITIES,
];

const App = props => {
  const {
    children,
    features,
    fetchEnrollmentStatus,
    formData,
    location,
    setFormData,
    user,
    identityVerified,
    router,
  } = props;
  const { veteranFullName } = formData;
  const { loading: isLoadingFeatures, isProdEnabled } = features;
  const {
    dob: veteranDateOfBirth,
    gender: veteranGender,
    loading: isLoadingProfile,
  } = user;

  const isAppLoading = isLoadingFeatures || isLoadingProfile;

  // Route Guard selectors
  const isRouteGuardEnabled = useSelector(
    state => toggleValues(state)[FEATURE_FLAG_NAMES.ezrRouteGuardEnabled],
  );
  const profile = useSelector(selectProfile);
  const { isUserLOA3 } = useSelector(selectAuthStatus);
  const { canSubmitFinancialInfo } = useSelector(selectEnrollmentStatus);
  const message = location?.state?.message;

  // Route Guard checks
  useEffect(
    () => {
      if (!isRouteGuardEnabled) {
        return;
      }

      // Check if user has preferred facility
      if (identityVerified && !profile?.facilities?.length) {
        router.push('/my-health/');
        return;
      }

      // Check for required backend services
      const hasRequiredServices = REQUIRED_BACKEND_SERVICES.every(service =>
        user.profile.services?.includes(service),
      );

      if (identityVerified && !hasRequiredServices) {
        router.push('/my-health/');
      }
    },
    [
      isRouteGuardEnabled,
      identityVerified,
      profile,
      router,
      user.profile.services,
    ],
  );

  // Form data initialization
  useEffect(
    () => {
      if (isUserLOA3) {
        fetchEnrollmentStatus();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isUserLOA3, fetchEnrollmentStatus],
  );

  /**
   * Set default view fields in the form data
   *
   * NOTE: veteranFullName is included in the dependency list to reset view fields when
   * starting a new application from save-in-progress.
   *
   * NOTE (2): the Date of Birth & Gender values from the user's profile are included to
   * fix a bug where some profiles do not contain a DOB value. In this case, we need to
   * ask the user for that data for proper submission.
   */
  useEffect(
    () => {
      if (!isAppLoading) {
        const defaultViewFields = {
          'view:userGender': parseVeteranGender(veteranGender),
          'view:userDob': parseVeteranDob(veteranDateOfBirth),
          'view:householdEnabled': !!canSubmitFinancialInfo,
        };

        setFormData({
          ...formData,
          ...defaultViewFields,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isAppLoading,
      canSubmitFinancialInfo,
      veteranFullName,
      veteranDateOfBirth,
      veteranGender,
      formData,
      setFormData,
    ],
  );

  // Add Datadog UX monitoring to the application
  useBrowserMonitoring();

  if (isAppLoading || !isProdEnabled) {
    return (
      <va-loading-indicator
        message={content['load-app']}
        class="vads-u-margin-y--4"
        set-focus
      />
    );
  }

  const appContent = (
    <div>
      {message && (
        <div className="usa-alert usa-alert-warning">
          <div className="usa-alert-body">
            <p className="usa-alert-text">{message}</p>
          </div>
        </div>
      )}
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </div>
  );

  return (
    <RequiredLoginView
      serviceRequired={REQUIRED_BACKEND_SERVICES}
      user={user}
      verify={!identityVerified}
    >
      {appContent}
    </RequiredLoginView>
  );
};

App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  features: PropTypes.object,
  fetchEnrollmentStatus: PropTypes.func,
  formData: PropTypes.object,
  identityVerified: PropTypes.bool,
  location: PropTypes.object,
  router: PropTypes.object,
  setFormData: PropTypes.func,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  features: {
    loading: state.featureToggles.loading,
    isProdEnabled: state.featureToggles.ezrProdEnabled,
  },
  formData: state.form.data,
  user: state.user,
  identityVerified: isLOA3(state),
});

const mapDispatchToProps = {
  setFormData: setData,
  fetchEnrollmentStatus: fetchEnrollmentStatusAction,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(App),
);
