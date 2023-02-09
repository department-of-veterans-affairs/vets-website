import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from '@department-of-veterans-affairs/platform-forms/RoutedSavableApp';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';
import recordEvent from 'platform/monitoring/record-event';

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
    isAiqEnabled = false,
    isFacilitiesApiEnabled = false,
    isLoading = true,
    isLoggedIn,
    isShortFormEnabled = false,
    isSigiEnabled = false,
    getTotalDisabilityRating,
    totalDisabilityRating,
    user,
  } = props;

  // Attempt to fetch disability rating for authenticated users
  useEffect(
    () => {
      if (isLoggedIn) {
        getTotalDisabilityRating();
      }
    },
    [getTotalDisabilityRating, isLoggedIn],
  );

  /**
   * Set default view fields within the form data
   *
   * NOTE: we have included veteranFullName in the dependency list to reset view fields when starting a new application from save-in-progress.
   */
  useEffect(
    () => {
      const defaultViewFields = {
        'view:isLoggedIn': isLoggedIn,
        'view:isSigiEnabled': isSigiEnabled,
        'view:isAiqEnabled': isAiqEnabled,
        'view:isFacilitiesApiEnabled': isFacilitiesApiEnabled,
        'view:totalDisabilityRating': totalDisabilityRating || 0,
      };

      if (isLoggedIn) {
        setFormData({
          ...formData,
          ...defaultViewFields,
          'view:userDob': user.dob,
        });
      } else {
        setFormData({
          ...formData,
          ...defaultViewFields,
        });
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      formData.veteranFullName,
      hasSavedForm,
      isAiqEnabled,
      isLoggedIn,
      isShortFormEnabled,
      isSigiEnabled,
      isFacilitiesApiEnabled,
      totalDisabilityRating,
      user.dob,
    ],
  );

  // Attach analytics events to all yes/no radio inputs
  useEffect(
    () => {
      if (!isLoading) {
        const radios = document.querySelectorAll(
          'input[id$=Yes], input[id$=No]',
        );
        for (const radio of radios) {
          radio.onclick = e => {
            const label = e.target.nextElementSibling.innerText;
            recordEvent({
              'hca-radio-label': label,
              'hca-radio-clicked': e.target,
              'hca-radio-value-selected': e.target.value,
            });
          };
        }
      }
    },
    [isLoading, location],
  );

  // Add Datadog UX monitoring to the application
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
  isLoading: PropTypes.bool,
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
  hasSavedForm: state.user.profile.savedForms.some(
    form => form.form === VA_FORM_IDS.FORM_10_10EZ,
  ),
  isAiqEnabled: state.featureToggles.hcaAmericanIndianEnabled,
  isFacilitiesApiEnabled: state.featureToggles.hcaUseFacilitiesApi,
  isLoading: state.featureToggles.loading,
  isLoggedIn: state.user.login.currentlyLoggedIn,
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
