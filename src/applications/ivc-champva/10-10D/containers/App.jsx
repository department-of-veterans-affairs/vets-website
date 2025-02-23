import React, { useEffect } from 'react';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import { useBrowserMonitoring } from '../helpers/useBrowserMonitoring';
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
    label: `Apply for CHAMPVA benefits`,
  },
];

export default function App({ location, children }) {
  document.title = `${formConfig.title} | Veterans Affairs`;
  useEffect(() => {
    // Insert CSS to hide 'For example: January 19 2000' hint on memorable dates
    // (can't be overridden by passing 'hint' to uiOptions):
    addStyleToShadowDomOnPages(
      [''],
      ['va-memorable-date'],
      '#dateHint {display: none}',
    );
  });

  // Add Datadog RUM to the app
  useBrowserMonitoring();

  return (
    <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
      <VaBreadcrumbs wrapping breadcrumbList={breadcrumbList} />
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
