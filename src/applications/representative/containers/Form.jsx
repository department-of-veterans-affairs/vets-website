import React from 'react';

import FormFooter from '@department-of-veterans-affairs/platform-forms/FormFooter';
import RoutedSavableApp from '@department-of-veterans-affairs/platform-forms/RoutedSavableApp';

import formConfig from '../config/form';

export default function Form({ children, location }) {
  return (
    <>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
      <FormFooter formConfig={formConfig} />
    </>
  );
}
