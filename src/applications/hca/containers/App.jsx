import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { selectAuthStatus, selectFeatureToggles } from '../utils/selectors';
import { useBrowserMonitoring } from '../hooks/useBrowserMonitoring';
import { useDefaultFormData } from '../hooks/useDefaultFormData';
import { useLoa3UserData } from '../hooks/useLoa3UserData';
import content from '../locales/en/content.json';
import formConfig from '../config/form';

const App = ({ children, location }) => {
  const { isLoadingFeatureFlags, isLoadingProfile } = useSelector(state => ({
    isLoadingFeatureFlags: selectFeatureToggles(state).isLoadingFeatureFlags,
    isLoadingProfile: selectAuthStatus(state).isLoadingProfile,
  }));
  const isAppLoading = useMemo(
    () => isLoadingFeatureFlags || isLoadingProfile,
    [isLoadingFeatureFlags, isLoadingProfile],
  );

  // Fetch appropriate data for LOA3 users
  useLoa3UserData();

  // Set default view fields within the form data
  useDefaultFormData();

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
  location: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default App;
