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
  useEffect(() => {
    // Insert CSS to hide 'For example: January 19 2000' hint on memorable dates
    // (can't be overridden by passing 'hint' to uiOptions):
    addStyleToShadowDomOnPages(
      [''],
      ['va-memorable-date'],
      '#dateHint {display: none}',
    );
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
