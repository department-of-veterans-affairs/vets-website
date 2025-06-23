import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { renderMHVDowntime } from '@department-of-veterans-affairs/mhv/exports';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';
import { datadogRum } from '@datadog/browser-rum';

import HeaderLayout from '../HeaderLayout';
import HelpdeskNonPatient from './HelpdeskNonPatient';
import VaHealthResources from './VaHealthResources';
import DownloadDataSection from './DownloadDataSection';
import HubLinks from '../HubLinks';
import NewsletterSignup from '../NewsletterSignup';
import manifest from '../../manifest.json';

const NON_PATIENT_PAGE = 'non-patient';

const NonPatientLandingPage = ({ data = {}, recordEvent = recordEventFn }) => {
  const { nonPatientHubs = [], healthResourcesLinks = [] } = data;

  useEffect(
    () => {
      const url = new URL(window.location.href);
      url.searchParams.set('page', NON_PATIENT_PAGE);
      window.history.replaceState({}, '', url);

      recordEvent({ event: 'nav-non-patient-landing-page' });
      datadogRum.addAction('Showed non-patient landing page');
    },
    [recordEvent],
  );

  return (
    <div
      className="vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--5"
      data-testid="non-patient-landing-page-container"
    >
      <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
        <VaBreadcrumbs
          homeVeteransAffairs
          breadcrumbList={[
            { label: 'VA.gov home', href: '/' },
            { label: 'My HealtheVet', href: manifest.rootUrl },
          ]}
        />
        <DowntimeNotification
          appTitle={manifest.appName}
          dependencies={[externalServices.mhvPlatform]}
          render={renderMHVDowntime}
        />
        <HeaderLayout showWelcomeMessage={false} />
        <HelpdeskNonPatient />
        <VaHealthResources healthResourcesLinks={healthResourcesLinks} />
        <DownloadDataSection />
      </div>
      <HubLinks hubs={nonPatientHubs} />
      <NewsletterSignup />
    </div>
  );
};

NonPatientLandingPage.propTypes = {
  data: PropTypes.object,
  recordEvent: PropTypes.func,
};

export default NonPatientLandingPage;
