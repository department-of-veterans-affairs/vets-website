import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from '@department-of-veterans-affairs/platform-forms/RoutedSavableApp';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';
import recordEvent from 'platform/monitoring/record-event';

import { fetchTotalDisabilityRating } from '../utils/actions';
import { useBrowserMonitoring } from '../hooks/useBrowserMonitoring';
import { parseVeteranDob } from '../utils/helpers';
import { isUserLOA3 } from '../utils/selectors';
import formConfig from '../config/form';

const App = props => {
  const {
    children,
    location,
    features,
    formData,
    isLOA3User,
    isLoggedIn,
    setFormData,
    hasSavedForm,
    isLoading = true,
    totalDisabilityRating,
    getTotalDisabilityRating,
    user,
  } = props;

  const { isFacilitiesApiEnabled = false, isSigiEnabled = false } = features;

  // Attempt to fetch disability rating for LOA3 users
  useEffect(
    () => {
      if (isLOA3User) {
        getTotalDisabilityRating();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLOA3User],
  );

  /**
   * Set default view fields within the form data
   *
   * NOTE: we have included veteranFullName in the dependency list to reset view fields when
   * starting a new application from save-in-progress.
   *
   * NOTE (2): we also included the DOB value from profile for authenticated users to fix a bug
   * where some profiles did not contain a DOB value. In this case we need to ask the user for
   * that data for proper submission.
   */
  useEffect(
    () => {
      const defaultViewFields = {
        'view:isLoggedIn': isLoggedIn,
        'view:isSigiEnabled': isSigiEnabled,
        'view:isFacilitiesApiEnabled': isFacilitiesApiEnabled,
        'view:totalDisabilityRating': parseInt(totalDisabilityRating, 10) || 0,
      };

      if (isLoggedIn) {
        setFormData({
          ...formData,
          ...defaultViewFields,
          'view:userDob': parseVeteranDob(user.dob),
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
      user.dob,
      isLoggedIn,
      hasSavedForm,
      isSigiEnabled,
      isFacilitiesApiEnabled,
      totalDisabilityRating,
      formData.veteranFullName,
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
  features: PropTypes.object,
  formData: PropTypes.object,
  getTotalDisabilityRating: PropTypes.func,
  hasSavedForm: PropTypes.bool,
  isLOA3User: PropTypes.bool,
  isLoading: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  location: PropTypes.object,
  setFormData: PropTypes.func,
  totalDisabilityRating: PropTypes.number,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  features: {
    isFacilitiesApiEnabled: state.featureToggles.hcaUseFacilitiesApi,
    isSigiEnabled: state.featureToggles.hcaSigiEnabled,
  },
  formData: state.form.data,
  hasSavedForm: state.user.profile.savedForms.some(
    form => form.form === VA_FORM_IDS.FORM_10_10EZ,
  ),
  isLOA3User: isUserLOA3(state),
  isLoading: state.featureToggles.loading,
  isLoggedIn: state.user.login.currentlyLoggedIn,
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
