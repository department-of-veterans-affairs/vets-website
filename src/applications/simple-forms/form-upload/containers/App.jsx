import React, { useEffect } from 'react';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import formConfig from '../config/form';
import { getFormContent, formMappings } from '../helpers';

const config = formConfig();

const App = ({ location, children }) => {
  const { formNumber } = getFormContent();

  useEffect(
    () => {
      document.title = `Upload form ${formNumber} | Veterans Affairs`;
    },
    [formNumber],
  );

  useEffect(
    () => {
      const minimalHeader = document.querySelector(
        '#header-minimal va-header-minimal',
      );
      // dynamically update the title / subheader per form
      if (minimalHeader) {
        minimalHeader.setAttribute('header', `Upload VA Form ${formNumber}`);
        minimalHeader.setAttribute(
          'subheader',
          formMappings[formNumber].subTitle,
        );
      }
    },
    [formNumber],
  );

  return (
    <RoutedSavableApp formConfig={config} currentLocation={location}>
      <DowntimeNotification
        appTitle="Upload VA forms"
        dependencies={[externalServices.formUploadBenefitsIntake]}
      >
        {children}
      </DowntimeNotification>
    </RoutedSavableApp>
  );
};

export default App;
