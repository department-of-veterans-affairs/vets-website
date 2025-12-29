import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { setData } from 'platform/forms-system/src/js/actions';

import { selectEnrollmentStatus } from '../utils/selectors';
import { useBrowserMonitoring } from '../hooks/useBrowserMonitoring';
import { useLoa3UserData } from '../hooks/useLoa3UserData';
import { parseVeteranDob, parseVeteranGender } from '../utils/helpers/general';
import content from '../locales/en/content.json';
import formConfig from '../config/form';

const App = props => {
  const { children, features, formData, location, setFormData, user } = props;
  const { veteranFullName } = formData;
  const {
    loading: isLoadingFeatures,
    isEmergencyContactsEnabled,
    isProvidersAndDependentsPrefillEnabled,
    isSpouseConfirmationFlowEnabled,
    isDownloadPdfEnabled,
  } = features;
  const {
    dob: veteranDateOfBirth,
    gender: veteranGender,
    loading: isLoadingProfile,
  } = user;
  const isAppLoading = isLoadingFeatures || isLoadingProfile;
  const { canSubmitFinancialInfo } = useSelector(selectEnrollmentStatus);

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
          'view:isDownloadPdfEnabled': !!isDownloadPdfEnabled,
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
      isDownloadPdfEnabled,
    ],
  );

  // fetch appropriate data for LOA3 users
  useLoa3UserData();

  // add Datadog UX monitoring
  useBrowserMonitoring();

  return isAppLoading ? (
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
  formData: PropTypes.object,
  location: PropTypes.object,
  setFormData: PropTypes.func,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  features: {
    loading: state.featureToggles.loading,
    isEmergencyContactsEnabled:
      state.featureToggles.ezrEmergencyContactsEnabled,
    isProvidersAndDependentsPrefillEnabled:
      state.featureToggles.ezrFormPrefillWithProvidersAndDependents,
    isSpouseConfirmationFlowEnabled:
      state.featureToggles.ezrSpouseConfirmationFlowEnabled,
    isDownloadPdfEnabled: state.featureToggles.ezrDownloadPdfEnabled,
  },
  formData: state.form.data,
  user: state.user.profile,
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
