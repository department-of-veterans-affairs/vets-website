import React from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import formConfig from '../config/form';

export default function App({ location, children }) {
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      <DowntimeNotification
        appTitle="lay or witness statement system"
        dependencies={[externalServices.lighthouseBenefitsIntake]}
      >
        {children}
      </DowntimeNotification>
    </RoutedSavableApp>
  );
}
