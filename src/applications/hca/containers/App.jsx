import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from '@department-of-veterans-affairs/platform-forms/RoutedSavableApp';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { isLOA3, isLoggedIn, selectProfile } from 'platform/user/selectors';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import recordEvent from 'platform/monitoring/record-event';

import { fetchTotalDisabilityRating } from '../utils/actions';
import { useBrowserMonitoring } from '../hooks/useBrowserMonitoring';
import { parseVeteranDob } from '../utils/helpers';
import formConfig from '../config/form';

const App = props => {
  const { children, location, setFormData, getTotalDisabilityRating } = props;

  const {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
  } = useFeatureToggle();
  const isFacilitiesApiEnabled = useToggleValue(
    TOGGLE_NAMES.hcaUseFacilitiesApi,
  );
  const isSigiEnabled = useToggleValue(TOGGLE_NAMES.hcaSigiEnabled);
  const isLoading = useToggleLoadingValue();

  const { totalDisabilityRating } = useSelector(state => state.totalRating);
  const { data: formData } = useSelector(state => state.form);
  const { dob: veteranDob } = useSelector(selectProfile);
  const loggedIn = useSelector(isLoggedIn);
  const isLOA3User = useSelector(isLOA3);
  const { veteranFullName } = formData;

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
        'view:isLoggedIn': loggedIn,
        'view:isSigiEnabled': isSigiEnabled,
        'view:isFacilitiesApiEnabled': isFacilitiesApiEnabled,
        'view:totalDisabilityRating': parseInt(totalDisabilityRating, 10) || 0,
      };

      if (loggedIn) {
        setFormData({
          ...formData,
          ...defaultViewFields,
          'view:userDob': parseVeteranDob(veteranDob),
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
      loggedIn,
      veteranDob,
      veteranFullName,
      isSigiEnabled,
      isFacilitiesApiEnabled,
      totalDisabilityRating,
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
  getTotalDisabilityRating: PropTypes.func,
  location: PropTypes.object,
  setFormData: PropTypes.func,
};

const mapDispatchToProps = {
  setFormData: setData,
  getTotalDisabilityRating: fetchTotalDisabilityRating,
};

export default connect(
  null,
  mapDispatchToProps,
)(App);
