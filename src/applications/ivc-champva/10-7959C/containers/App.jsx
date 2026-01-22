import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { DowntimeNotification } from 'platform/monitoring/DowntimeNotification';
import environment from 'platform/utilities/environment';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useBrowserMonitoring } from 'platform/monitoring/Datadog';
import { useDefaultFormData } from '../hooks/useDefaultFormData';
import formConfig from '../config/form';

const App = ({ location, children }) => {
  const isAppLoading = useSelector(
    state => state.featureToggles?.loading || state.user?.profile?.loading,
  );

  useDefaultFormData();
  useBrowserMonitoring({
    loggedIn: undefined,
    toggleName: 'form107959cBrowserMonitoringEnabled',
    applicationId: '3e211ba8-dbcd-4a8d-b3eb-18950d5a46bc',
    clientToken: 'pub383f4e654ef2030cd6045c8532593afc',
    service: 'ivc-ohi-10-7959c',
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
  });

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
