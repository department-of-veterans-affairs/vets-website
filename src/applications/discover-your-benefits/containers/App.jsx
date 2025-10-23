import React from 'react';
import PropTypes from 'prop-types';

import environment from 'platform/utilities/environment';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useBrowserMonitoring } from 'platform/monitoring/Datadog';
import SubmitHelper from '../components/SubmitHelper';
import formConfig from '../config/form';

export default function App({ location, children }) {
  // Add Datadog monitoring to the application
  useBrowserMonitoring({
    loggedIn: undefined, // optional, pass a boolean if log in required
    toggleName: 'discoverYourBenefitsBrowserMonitoringEnabled',
    applicationId: '4fd7481e-66ef-4a89-86d0-84e691ffdfa5',
    clientToken: 'pub02875174418494ddae85287f690d16d6',
    service: 'discover-your-benefits',
    version: '1.0.0',
    sessionReplaySampleRate:
      environment.vspEnvironment() === 'staging' ? 100 : 10,
    // Add any additional RUM or LOG settings here
  });

  return (
    <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0 discover-your-benefits">
      <VaBreadcrumbs
        breadcrumbList={[
          {
            href: '/',
            label: 'VA.gov Home',
          },
          {
            href: '/discover-your-benefits',
            label: formConfig.title,
          },
        ]}
        label="Breadcrumb"
        wrapping
      />
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        <SubmitHelper />
        {children}
      </RoutedSavableApp>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
};
