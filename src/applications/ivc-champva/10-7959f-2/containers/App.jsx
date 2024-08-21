import React from 'react';
import PropTypes from 'prop-types';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';

export default function App({ location, children }) {
  const breadcrumbs = [
    { href: '/', label: 'Home' },
    { href: '/health-care', label: 'Health care' },
    {
      href: '/health-care/foreign-medical-program',
      label: 'Foreign Medical Program',
    },
    { href: '/health-care/foreign-medical-program', label: 'File a claim' },
  ];
  const bcString = JSON.stringify(breadcrumbs);

  return (
    <>
      <va-breadcrumbs breadcrumb-list={bcString} />
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        <DowntimeNotification
          appTitle={`CHAMPVA Form ${formConfig.formId}`}
          dependencies={[externalServices.pega]}
        >
          {children}
        </DowntimeNotification>
      </RoutedSavableApp>
    </>
  );
}

App.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
};
