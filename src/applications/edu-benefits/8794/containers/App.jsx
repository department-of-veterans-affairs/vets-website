import React, { useEffect } from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import { addStyleToShadowDomOnPages } from '../../utils/helpers';
import Breadcrumbs from '../components/Breadcrumbs';
import NeedHelp from '../components/NeedHelp';

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
    <div className="form-22-8794-container row">
      <div className="desktop-lg:vads-u-padding-left--0 vads-u-padding-left--2">
        <Breadcrumbs />
      </div>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
      <NeedHelp />
    </div>
  );
}
