import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { selectFeatureToggles } from '../utils/selectors/feature-toggles';
import { selectAuthStatus } from '../utils/selectors/auth-status';
import { useBrowserMonitoring } from '../hooks/useBrowserMonitoring';
import { useYesNoInputEvents } from '../hooks/useYesNoInputEvents';
import { useDefaultFormData } from '../hooks/useDefaultFormData';
import { useLoa3UserData } from '../hooks/useLoa3UserData';
import content from '../locales/en/content.json';
import formConfig from '../config/form';

const App = props => {
  const { children, location } = props;
  const { isLoadingFeatureFlags } = useSelector(selectFeatureToggles);
  const { isLoadingProfile } = useSelector(selectAuthStatus);
  const isAppLoading = isLoadingFeatureFlags || isLoadingProfile;

  // Fetch appropriate data for LOA3 users
  useLoa3UserData();

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
  location: PropTypes.object,
};

export default App;
