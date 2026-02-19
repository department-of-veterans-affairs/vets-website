import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { setData } from 'platform/forms-system/src/js/actions';

import { fetchEnrollmentStatus as fetchEnrollmentStatusAction } from '../utils/actions/enrollment-status';
import { selectAuthStatus } from '../utils/selectors/auth-status';
import { selectEnrollmentStatus } from '../utils/selectors/entrollment-status';
import { useBrowserMonitoring } from '../hooks/useBrowserMonitoring';
import { parseVeteranDob, parseVeteranGender } from '../utils/helpers/general';
import content from '../locales/en/content.json';
import formConfig from '../config/form';

const App = props => {
  const {
    children,
    features,
    fetchEnrollmentStatus,
    formData,
    location,
    setFormData,
    user,
  } = props;
  const { veteranFullName } = formData;
  const {
    loading: isLoadingFeatures,
    isProdEnabled,
    isEmergencyContactsEnabled,
    isProvidersAndDependentsPrefillEnabled,
    isSpouseConfirmationFlowEnabled,
  } = features;
  const ezrServiceHistoryEnabled = true; // This feature is always enabled in the EZR app!!!
  const {
    dob: veteranDateOfBirth,
    gender: veteranGender,
    loading: isLoadingProfile,
  } = user;
  const isAppLoading = isLoadingFeatures || isLoadingProfile;
  const { isUserLOA3 } = useSelector(selectAuthStatus);
  const { canSubmitFinancialInfo } = useSelector(selectEnrollmentStatus);

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
          'view:isEmergencyContactsEnabled': !!isEmergencyContactsEnabled,
          'view:isProvidersAndDependentsPrefillEnabled': !!isProvidersAndDependentsPrefillEnabled,
          'view:isSpouseConfirmationFlowEnabled': !!isSpouseConfirmationFlowEnabled,
          'view:ezrServiceHistoryEnabled': !!ezrServiceHistoryEnabled,
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
      veteranGender,
      veteranDateOfBirth,
      canSubmitFinancialInfo,
      isEmergencyContactsEnabled,
      veteranFullName,
      isProvidersAndDependentsPrefillEnabled,
      isSpouseConfirmationFlowEnabled,
    ],
  );

  // Add Datadog UX monitoring to the application
  useBrowserMonitoring();

  return isAppLoading || !isProdEnabled ? (
    <va-loading-indicator
      message={content['load-app']}
      class="vads-u-margin-y--4"
      set-focus
    />
  ) : (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
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
};

const mapStateToProps = state => ({
  features: {
    loading: state.featureToggles.loading,
    isProdEnabled: state.featureToggles.ezrProdEnabled,
    isEmergencyContactsEnabled:
      state.featureToggles.ezrEmergencyContactsEnabled,
    isProvidersAndDependentsPrefillEnabled:
      state.featureToggles.ezrFormPrefillWithProvidersAndDependents,
    isSpouseConfirmationFlowEnabled:
      state.featureToggles.ezrSpouseConfirmationFlowEnabled,
    ezrServiceHistoryEnabled: state.featureToggles.ezrServiceHistoryEnabled,
  },
  formData: state.form.data,
  user: state.user.profile,
});

const mapDispatchToProps = {
  setFormData: setData,
  fetchEnrollmentStatus: fetchEnrollmentStatusAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
