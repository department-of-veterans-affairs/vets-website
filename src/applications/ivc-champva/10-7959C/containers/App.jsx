import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { Toggler } from 'platform/utilities/feature-toggles';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { useBrowserMonitoring } from 'platform/monitoring/Datadog';
import formConfig from '../config/form';
import WIP from '../../shared/components/WIP';
import { addStyleToShadowDomOnPages } from '../../shared/utilities';

const breadcrumbList = [
  { href: '/', label: 'Home' },
  {
    href: `/family-and-caregiver-benefits`,
    label: `Family and caregiver benefits`,
  },
  {
    href: `/family-and-caregiver-benefits/health-and-disability/`,
    label: `Health and disability benefits for family and caregivers`,
  },
  {
    href: `/family-and-caregiver-benefits/health-and-disability/champva`,
    label: `CHAMPVA benefits`,
  },
  {
    href: `#content`,
    label: formConfig.title,
  },
];

export default function App({ location, children }) {
  // Add Datadog RUM to the app
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

  document.title = `${formConfig.title} | Veterans Affairs`;
  useEffect(() => {
    // Insert CSS to hide 'For example: January 19 2000' hint on memorable dates
    // (can't be overridden by passing 'hint' to uiOptions):
    addStyleToShadowDomOnPages(
      [''],
      ['va-memorable-date'],
      '#dateHint {display: none}',
    );
    breadcrumbList.slice(-1).label = document.querySelector('h1');
  });

  return (
    <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
      <Toggler toggleName={Toggler.TOGGLE_NAMES.form107959c}>
        <Toggler.Enabled>
          <VaBreadcrumbs wrapping breadcrumbList={breadcrumbList} />
          <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
            <DowntimeNotification
              appTitle={`CHAMPVA Form ${formConfig.formId}`}
              dependencies={[
                externalServices.pega,
                externalServices.form107959c,
              ]}
            >
              {children}
            </DowntimeNotification>
          </RoutedSavableApp>
        </Toggler.Enabled>
        <Toggler.Disabled>
          <br />
          <WIP
            content={{
              description:
                'We’re rolling out the CHAMPVA Other Health Insurance Certification form (VA Form 10-7959c) in stages. It’s not quite ready yet. Please check back again soon.',
              redirectLink: '/',
              redirectText: 'Return to VA home page',
            }}
          />
        </Toggler.Disabled>
      </Toggler>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
};
