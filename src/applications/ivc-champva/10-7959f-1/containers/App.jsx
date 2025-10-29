import React from 'react';
import { DowntimeNotification } from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import PropTypes from 'prop-types';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useBrowserMonitoring } from 'platform/monitoring/Datadog';
import formConfig from '../config/form';

export default function App({ location, children }) {
  // Add Datadog RUM to the app
  useBrowserMonitoring({
    loggedIn: undefined,
    toggleName: 'form107959f1BrowserMonitoringEnabled',
    applicationId: 'aef8217e-08a7-41d5-ab23-ea2754e34918',
    clientToken: 'pub91bc824f56461a9a17975ef5d399e423',
    service: '-ivc-10-7959f-1-fmp-rum',
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

  const breadcrumbList = [
    { href: '/', label: 'Home' },
    { href: '/health-care', label: 'Health care' },
    {
      href: '/health-care/foreign-medical-program',
      label: 'Foreign Medical Program (FMP)',
    },
    {
      href: '/intro',
      label: 'Register for the Foreign Medical Program (FMP)',
    },
  ];
  const bcString = JSON.stringify(breadcrumbList);
  return (
    <>
      <meta content="noindex" />
      <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
        <va-breadcrumbs breadcrumb-list={bcString} />
        <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
          <DowntimeNotification
            appTitle={`CHAMPVA Form ${formConfig.formId}`}
            dependencies={formConfig.downtime.dependencies}
          >
            {children}
          </DowntimeNotification>
        </RoutedSavableApp>
      </div>
    </>
  );
}

App.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
};
