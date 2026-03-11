import React from 'react';
import PropTypes from 'prop-types';
import { shallowEqual, useSelector } from 'react-redux';
import environment from 'platform/utilities/environment';
import { isProfileLoading } from 'platform/user/selectors';
import { DowntimeNotification } from 'platform/monitoring/DowntimeNotification';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useBrowserMonitoring } from 'platform/monitoring/Datadog';
import formConfig from '../config/form';

const EXCLUDED_DOMAINS = [
  'resource.digital.voice.va.gov',
  'browser-intake-ddog-gov.com',
  'google-analytics.com',
  'eauth.va.gov',
  'api.va.gov',
];

const BROWSER_MONITORING_PROPS = {
  toggleName: 'form107959f1BrowserMonitoringEnabled',
  applicationId: 'aef8217e-08a7-41d5-ab23-ea2754e34918',
  clientToken: 'pub91bc824f56461a9a17975ef5d399e423',
  service: '-ivc-10-7959f-1-fmp-rum',
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
  const isAppLoading = useSelector(
    state =>
      state?.featureToggles?.loading === true ||
      isProfileLoading(state) === true,
    shallowEqual,
  );

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
