import React, { useEffect } from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import formConfig from '../config/form';

export default function App({ location, children }) {
  useEffect(() => {
    document.body.classList.add('sf-4140-app');
    return () => {
      document.body.classList.remove('sf-4140-app');
    };
  }, []);

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      <DowntimeNotification
        appTitle="employee questionnaire for VA disability benefits"
        dependencies={[externalServices.lighthouseBenefitsIntake]}
      >
        {children}
      </DowntimeNotification>
    </RoutedSavableApp>
  );
}
