import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

// VA Platform Components
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { isLOA3, selectProfile } from 'platform/user/selectors';
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
    router,
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
  const profile = useSelector(selectProfile);

  // Route Guard checks
  useEffect(
    () => {
      if (!ezrRouteGuardEnabled) {
        return;
      }

      // Check if user has required services and facilities
      const hasRequiredServices = REQUIRED_BACKEND_SERVICES.every(service =>
        user.profile.services?.includes(service),
      );

      if (
        identityVerified &&
        (!hasRequiredServices || !profile?.facilities?.length)
      ) {
        window.location.href = '/my-health/';
      }
    },
    [
      ezrRouteGuardEnabled,
      identityVerified,
      profile,
      router,
      user.profile.services,
    ],
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
  location: PropTypes.object,
  setFormData: PropTypes.func,
  user: PropTypes.object,
  router: PropTypes.object,
  identityVerified: PropTypes.bool,
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
