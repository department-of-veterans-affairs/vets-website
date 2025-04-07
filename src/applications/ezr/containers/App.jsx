import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

// VA Platform Components
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { isLOA3 } from 'platform/user/selectors';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { setData } from 'platform/forms-system/src/js/actions';

// Local Components and Utils
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
  } = props;

  const { veteranFullName } = formData;
  const {
    loading: isLoadingFeatures,
    isProdEnabled,
    ezrRouteGuardEnabled,
  } = features;
  const {
    dob: veteranDateOfBirth,
    gender: veteranGender,
    loading: isLoadingProfile,
  } = user;
  const isAppLoading = isLoadingFeatures || isLoadingProfile;
  const { isUserLOA3 } = useSelector(selectAuthStatus);
  const { canSubmitFinancialInfo } = useSelector(selectEnrollmentStatus);
  const { profile } = user;

  // Check if user has required services and facilities
  const hasRequiredServices = REQUIRED_BACKEND_SERVICES.every(
    service =>
      profile?.services?.includes(service) || user?.services?.includes(service),
  );

  // Check if user has any facilities
  const hasFacilities = profile?.facilities?.length > 0;

  // Check if all required data is loaded
  const isDataLoaded =
    !isAppLoading && // Wait for app to load
    ezrRouteGuardEnabled !== undefined && // Wait for feature flag
    profile.loading === false && // Wait for profile
    profile !== undefined; // Wait for profile data

  // Route guard effect
  useEffect(
    () => {
      if (
        isDataLoaded &&
        (!identityVerified || // LOA1 users
          (identityVerified && (!hasRequiredServices || !hasFacilities))) // LOA3 users without required access
      ) {
        window.location.href = '/my-health/';
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDataLoaded, identityVerified, hasRequiredServices, hasFacilities],
  );

  useEffect(
    () => {
      if (isUserLOA3) {
        fetchEnrollmentStatus();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isUserLOA3],
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
    [isAppLoading, canSubmitFinancialInfo, veteranFullName],
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
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
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
  setFormData: PropTypes.func,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  features: {
    loading: state.featureToggles.loading,
    isProdEnabled: state.featureToggles.ezrProdEnabled,
    ezrRouteGuardEnabled: state.featureToggles.ezrRouteGuardEnabled,
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
