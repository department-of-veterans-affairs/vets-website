import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from '~/platform/forms/save-in-progress/RoutedSavableApp';
import recordEvent from '~/platform/monitoring/record-event';
import { setData } from '~/platform/forms-system/src/js/actions';
import { selectProfile } from '~/platform/user/selectors';

import { fetchEnrollmentStatus } from '../utils/actions/enrollment-status';
import { fetchTotalDisabilityRating } from '../utils/actions/disability-rating';
import { selectFeatureToggles } from '../utils/selectors/feature-toggles';
import { selectAuthStatus } from '../utils/selectors/auth-status';
import { useBrowserMonitoring } from '../hooks/useBrowserMonitoring';
import { parseVeteranDob } from '../utils/helpers';
import content from '../locales/en/content.json';
import formConfig from '../config/form';

const App = props => {
  const {
    children,
    location,
    setFormData,
    getDisabilityRating,
    getEnrollmentStatus,
  } = props;

  const {
    isLoadingFeatureFlags,
    isFacilitiesApiEnabled,
    isRegOnlyEnabled,
    isSigiEnabled,
  } = useSelector(selectFeatureToggles);
  const { dob: veteranDob } = useSelector(selectProfile);
  const { totalRating } = useSelector(state => state.disabilityRating);
  const { data: formData } = useSelector(state => state.form);
  const { isUserLOA3, isLoggedIn, isLoadingProfile } = useSelector(
    selectAuthStatus,
  );
  const { veteranFullName } = formData;
  const isAppLoading = isLoadingFeatureFlags || isLoadingProfile;

  // Attempt to fetch disability rating for LOA3 users
  useEffect(
    () => {
      if (isUserLOA3) {
        getDisabilityRating();
        getEnrollmentStatus();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isUserLOA3],
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
        'view:isRegOnlyEnabled': isRegOnlyEnabled,
        'view:isFacilitiesApiEnabled': isFacilitiesApiEnabled,
        'view:totalDisabilityRating': parseInt(totalRating, 10) || 0,
      };

      if (isLoggedIn) {
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
      isLoggedIn,
      veteranDob,
      veteranFullName,
      isSigiEnabled,
      isRegOnlyEnabled,
      isFacilitiesApiEnabled,
      totalRating,
    ],
  );

  // Attach analytics events to all yes/no radio inputs
  useEffect(
    () => {
      if (!isAppLoading) {
        const radios = document.querySelectorAll(
          'input[id$=Yes], input[id$=No]',
        );
        for (const radio of radios) {
          radio.onclick = e => {
            const label = e.target.nextElementSibling.innerText;
            recordEvent({
              event: 'hca-yesno-option-click',
              'hca-radio-label': label,
              'hca-radio-clicked': e.target,
              'hca-radio-value-selected': e.target.value,
            });
          };
        }
      }
    },
    [isAppLoading, location],
  );

  // Add Datadog UX monitoring to the application
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
  getDisabilityRating: PropTypes.func,
  getEnrollmentStatus: PropTypes.func,
  location: PropTypes.object,
  setFormData: PropTypes.func,
};

const mapDispatchToProps = {
  setFormData: setData,
  getEnrollmentStatus: fetchEnrollmentStatus,
  getDisabilityRating: fetchTotalDisabilityRating,
};

export default connect(
  null,
  mapDispatchToProps,
)(App);
