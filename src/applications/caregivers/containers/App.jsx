import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { selectFeatureToggles } from '../utils/selectors';
import { useBrowserMonitoring } from '../hooks/useBrowserMonitoring';
import { useDefaultFormData } from '../hooks/useDefaultFormData';
import formConfig from '../config/form';
import content from '../locales/en/content.json';

const App = ({ location, children }) => {
  const { isLoadingFeatureFlags: loading } = useSelector(selectFeatureToggles);

  // Set default view fields within the form data
  useDefaultFormData();

  // Add Datadog UX monitoring to the application
  useBrowserMonitoring();

  return loading ? (
    <va-loading-indicator
      message={content['app-loading-text']}
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
