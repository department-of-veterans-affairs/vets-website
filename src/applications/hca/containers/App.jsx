import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { fetchEnrollmentStatus } from '../utils/actions/enrollment-status';
import { fetchTotalDisabilityRating } from '../utils/actions/disability-rating';
import { selectFeatureToggles } from '../utils/selectors/feature-toggles';
import { selectAuthStatus } from '../utils/selectors/auth-status';
import { useBrowserMonitoring } from '../hooks/useBrowserMonitoring';
import { useYesNoInputEvents } from '../hooks/useYesNoInputEvents';
import { useDefaultFormData } from '../hooks/useDefaultFormData';
import content from '../locales/en/content.json';
import formConfig from '../config/form';

const App = props => {
  const {
    children,
    location,
    getDisabilityRating,
    getEnrollmentStatus,
  } = props;

  const { isLoadingFeatureFlags } = useSelector(selectFeatureToggles);
  const { isUserLOA3, isLoadingProfile } = useSelector(selectAuthStatus);
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

  // Set default view fields within the form data
  useDefaultFormData();

  // Attach analytics events to all yes/no radio inputs
  useYesNoInputEvents(isAppLoading, location);

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
};

const mapDispatchToProps = {
  getEnrollmentStatus: fetchEnrollmentStatus,
  getDisabilityRating: fetchTotalDisabilityRating,
};

export default connect(
  null,
  mapDispatchToProps,
)(App);
