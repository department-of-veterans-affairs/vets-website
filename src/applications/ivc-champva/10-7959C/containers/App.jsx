import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import formConfig from '../config/form';
import { addStyleToShadowDomOnPages } from '../../shared/utilities';

const breadcrumbList = [
  { href: '/', label: 'Home' },
  {
    href: `/family-and-caregiver-benefits`,
    label: `Family and caregiver benefits`,
  },
  {
    href: `/family-and-caregiver-benefits/health-and-disability/`,
    label: `Health and disability`,
  },
  {
    href: `/family-and-caregiver-benefits/health-and-disability/champva`,
    label: `CHAMPVA benefits`,
  },
];

export default function App({ location, children }) {
  // Insert CSS to hide 'For example: January 19 2000' hint on memorable dates
  // (can't be overridden by passing 'hint' to uiOptions):
  const urls = [
    formConfig.chapters.healthcareInformation.pages.primaryProvider.path,
    formConfig.chapters.healthcareInformation.pages.secondaryProvider.path,
  ];
  const targets = ['va-memorable-date'];
  const css = '#dateHint {display: none}';

  useEffect(() => {
    addStyleToShadowDomOnPages(urls, targets, css);
  });

  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <VaBreadcrumbs breadcrumbList={breadcrumbList} />
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
};
