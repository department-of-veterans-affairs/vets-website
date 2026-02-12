import React from 'react';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

import formConfig from '@bio-aquia/21-4192-employment-information/config/form';
import { useDatadogRum } from '@bio-aquia/shared/hooks';

/**
 * Main application container component for VA Form 21-4192 Employment Information
 *
 * Wraps the form with RoutedSavableApp to provide save-in-progress functionality,
 * auto-save on navigation, form state management, and session timeout handling.
 * This component is guarded by a feature flag.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child route components (form pages)
 * @param {Object} props.location - React Router location object
 */
export const App = ({ location, children }) => {
  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const isLoadingFeatures = useToggleLoadingValue();
  const formEnabled = useToggleValue(TOGGLE_NAMES.form4192Enabled);

  // Initialize Datadog RUM for form monitoring
  useDatadogRum('21-4192');

  // Show loading indicator while feature flags are being fetched
  // Note: Check !== false to handle initial undefined state before fetch starts
  if (isLoadingFeatures !== false) {
    return (
      <div className="vads-u-margin-y--5">
        <va-loading-indicator
          label="Loading"
          message="Loading application..."
          set-focus
        />
      </div>
    );
  }

  // Redirect to home if form is disabled
  if (!formEnabled) {
    window.location.replace('/forms/21-4192/');
    return null;
  }

  // Render normal app if flag is true
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
};

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};

export default App;
