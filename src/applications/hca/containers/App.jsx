import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from '@department-of-veterans-affairs/platform-forms/RoutedSavableApp';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';

import { fetchTotalDisabilityRating } from '../utils/actions';
import { useBrowserMonitoring } from '../hooks/useBrowserMonitoring';
import formConfig from '../config/form';

const App = props => {
  const {
    location,
    children,
    setFormData,
    formData,
    hasSavedForm,
    isLoggedIn,
    isAiqEnabled = false,
    isFacilitiesApiEnabled = false,
    isShortFormEnabled = false,
    isSigiEnabled = false,
    getTotalDisabilityRating,
    totalDisabilityRating,
    user,
  } = props;

  useEffect(
    () => {
      if (isLoggedIn) {
        getTotalDisabilityRating();
      }
    },
    [getTotalDisabilityRating, isLoggedIn],
  );

  useEffect(
    // included veteranFullName to reset view flipper toggles when starting a new application from save-in-progress
    // So users can complete the form as they started, we want to use 'view:isShortFormEnabled' from save in progress data,
    // we can check using hasSavedForm. This can be removed 90 days after hcaShortFormEnabled flipper toggle is fully enabled for all users
    () => {
      const defaultViewFields = {
        'view:isLoggedIn': isLoggedIn,
        'view:totalDisabilityRating': totalDisabilityRating || 0,
        'view:isSigiEnabled': isSigiEnabled,
        'view:isAiqEnabled': isAiqEnabled,
        'view:isFacilitiesApiEnabled': isFacilitiesApiEnabled,
      };

      if (hasSavedForm || typeof hasSavedForm === 'undefined') {
        setFormData({
          ...formData,
          ...defaultViewFields,
          'view:userDob': user.dob,
        });
      } else if (isLoggedIn) {
        setFormData({
          ...formData,
          ...defaultViewFields,
          'view:userDob': user.dob,
          'view:isShortFormEnabled': isShortFormEnabled,
        });
      } else {
        setFormData({
          ...formData,
          ...defaultViewFields,
          'view:isShortFormEnabled': isShortFormEnabled,
        });
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      formData.veteranFullName,
      hasSavedForm,
      isAiqEnabled,
      isFacilitiesApiEnabled,
      isLoggedIn,
      isShortFormEnabled,
      isSigiEnabled,
      totalDisabilityRating,
      user.dob,
    ],
  );

  // Add Datadog RUM to the
  useBrowserMonitoring();

  return (
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
  formData: PropTypes.object,
  getTotalDisabilityRating: PropTypes.func,
  hasSavedForm: PropTypes.bool,
  isAiqEnabled: PropTypes.bool,
  isFacilitiesApiEnabled: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  isShortFormEnabled: PropTypes.bool,
  isSigiEnabled: PropTypes.bool,
  location: PropTypes.object,
  setFormData: PropTypes.func,
  totalDisabilityRating: PropTypes.number,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  formData: state.form.data,
  hasSavedForm: state?.user?.profile?.savedForms.some(
    form => form.form === VA_FORM_IDS.FORM_10_10EZ,
  ),
  isAiqEnabled: state.featureToggles.hcaAmericanIndianEnabled,
  isFacilitiesApiEnabled: state.featureToggles.hcaUseFacilitiesApi,
  isLoggedIn: state?.user?.login?.currentlyLoggedIn,
  isShortFormEnabled: state.featureToggles.hcaShortFormEnabled,
  isSigiEnabled: state.featureToggles.caregiverSigiEnabled,
  totalDisabilityRating: state.totalRating.totalDisabilityRating,
  user: state.user.profile,
});

const mapDispatchToProps = {
  setFormData: setData,
  getTotalDisabilityRating: fetchTotalDisabilityRating,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
