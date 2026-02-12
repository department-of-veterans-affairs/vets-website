import React from 'react';
import PropTypes from 'prop-types';
import { shallowEqual, useSelector } from 'react-redux';
import environment from 'platform/utilities/environment';
import { useBrowserMonitoring } from 'platform/monitoring/Datadog';
import { DowntimeNotification } from 'platform/monitoring/DowntimeNotification';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import content from '../locales/en/content.json';

const EXCLUDED_DOMAINS = [
  'resource.digital.voice.va.gov',
  'browser-intake-ddog-gov.com',
  'google-analytics.com',
  'eauth.va.gov',
  'api.va.gov',
];

const BROWSER_MONITORING_PROPS = {
  toggleName: 'form1010dBrowserMonitoringEnabled',
  applicationId: 'cca24a05-9ea0-49ea-aaa9-0d1e04a17ba0',
  clientToken: 'puba5e0866f8008f60a6bc8b09ae555dd92',
  site: 'ddog-gov.com',
  service: '10-10d',
  env: environment.vspEnvironment(),
  sessionSampleRate: 100,
  sessionReplaySampleRate: 100,
  trackUserInteractions: true,
  trackFrustrations: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input',
  beforeSend: ({ resource, type }) => {
    return !(
      type === 'resource' &&
      EXCLUDED_DOMAINS.some(domain => resource.url.includes(domain))
    );
  },
};

const App = ({ location, children }) => {
  const isAppLoading = useSelector(
    state => state.featureToggles?.loading || state.user?.profile?.loading,
    shallowEqual,
  );

  useBrowserMonitoring(BROWSER_MONITORING_PROPS);

  return isAppLoading ? (
    <va-loading-indicator
      message={content['form-loading-text']}
      class="vads-u-margin-y--4"
      set-focus
    />
  ) : (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      <DowntimeNotification
        appTitle={formConfig.subTitle}
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
