import React from 'react';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';

export default function App({ location, children }) {
  const breadcrumbList = [
    { href: '/', label: 'Home' },
    { href: '/health-care', label: 'Health care' },
    {
      href: '/health-care/foreign-medical-program',
      label: 'Foreign Medical Program (FMP)',
    },
    {
      href: '/health-care/foreign-medical-program/',
      label: 'Register for the Foreign Medical Program (FMP)',
    },
  ];
  const bcString = JSON.stringify(breadcrumbList);
  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <va-breadcrumbs breadcrumb-list={bcString} />
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        <DowntimeNotification
          appTitle={`CHAMPVA Form ${formConfig.formId}`}
          dependencies={[externalServices.pega]}
        >
          {children}
        </DowntimeNotification>
      </RoutedSavableApp>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
};
