import React, { useEffect } from 'react';
import RoutedSavableApp from '@department-of-veterans-affairs/platform-forms/RoutedSavableApp';
import formConfig from '../config/form';

export default function Form({ children, location, router }) {
  useEffect(
    () => {
      window.scrollTo(0, 0);
    },
    [router],
  );
  const renderBreadcrumbs = () => {
    return [
      <a href="/" key="disability">
        Disability
      </a>,
      <a href="/" key="find-an-accredited-representative">
        Find an Accredited Representative
      </a>,
      <a href="/" key="appoint-a-representative">
        Appoint a Representative
      </a>,
    ];
  };
  return (
    <>
      <div>
        <va-breadcrumbs>{renderBreadcrumbs()}</va-breadcrumbs>
      </div>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
}
