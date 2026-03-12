import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { DowntimeNotification } from 'platform/monitoring/DowntimeNotification';
import environment from 'platform/utilities/environment';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useBrowserMonitoring } from 'platform/monitoring/Datadog';
import { useDefaultFormData } from '../hooks/useDefaultFormData';
import formConfig from '../config/form';

const EXCLUDED_DOMAINS = [
  'resource.digital.voice.va.gov',
  'browser-intake-ddog-gov.com',
  'google-analytics.com',
  'eauth.va.gov',
  'api.va.gov',
];

const BROWSER_MONITORING_PROPS = {
  toggleName: 'form107959aBrowserMonitoringEnabled',
  applicationId: '0f3d4991-c7b5-4a28-89c6-ea0e3f47b291',
  clientToken: 'puba4a6137df6bf240ff5e86ec697348c71',
  service: 'ivc-champva-claims-10-7959a',
  version: '1.0.0',
  env: environment.vspEnvironment(),
  sessionSampleRate: 100,
  sessionReplaySampleRate: 100,
  trackUserInteractions: true,
  trackFrustrations: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input',
  beforeSend: ({ action, type, resource }) => {
    // eslint-disable-next-line no-param-reassign
    if (action?.type === 'click') action.target.name = 'Form item';
    return !(
      type === 'resource' &&
      EXCLUDED_DOMAINS.some(domain => resource.url.includes(domain))
    );
  },
};

const App = ({ location, children }) => {
  const isAppLoading = useSelector(state =>
    Boolean(state.featureToggles?.loading || state.user?.profile?.loading),
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
