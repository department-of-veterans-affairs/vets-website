import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { DowntimeNotification } from 'platform/monitoring/DowntimeNotification';
import environment from 'platform/utilities/environment';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useBrowserMonitoring } from 'platform/monitoring/Datadog';
import { useDefaultFormData } from '../hooks/useDefaultFormData';
import formConfig from '../config/form';

// static constants
const BROWSER_MONITORING_PROPS = {
  toggleName: 'form107959aBrowserMonitoringEnabled',
  applicationId: '0f3d4991-c7b5-4a28-89c6-ea0e3f47b291',
  clientToken: 'puba4a6137df6bf240ff5e86ec697348c71',
  service: 'ivc-champva-claims-10-7959a',
  version: '1.0.0',
  // record 100% of staging sessions, but only 20% of production
  sessionReplaySampleRate:
    environment.vspEnvironment() === 'staging' ? 100 : 20,
  sessionSampleRate: 50,
  beforeSend: event => {
    // Prevent PII from being sent to Datadog with click actions.
    if (event.action?.type === 'click') {
      // eslint-disable-next-line no-param-reassign
      event.action.target.name = 'Clicked item';
    }
    return true;
  },
};

const App = ({ location, children }) => {
  const isAppLoading = useSelector(
    state => state.featureToggles?.loading || state.user?.profile?.loading,
  );

  useDefaultFormData();
  useBrowserMonitoring(BROWSER_MONITORING_PROPS);

  return isAppLoading ? (
    <va-loading-indicator
      message="Loading application..."
      class="vads-u-margin-y--4"
      set-focus
    />
  ) : (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      <DowntimeNotification
        appTitle={`CHAMPVA Form ${formConfig.formId}`}
        dependencies={formConfig.downtime.dependencies}
      >
        {children}
      </DowntimeNotification>
    </RoutedSavableApp>
  );
};

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
    href: PropTypes.string,
  }),
};

export default App;
