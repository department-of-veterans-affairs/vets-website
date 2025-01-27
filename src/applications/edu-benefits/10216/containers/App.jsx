import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import { addStyleToShadowDomOnPages } from '../../utils/helpers';
import BreadcrumbUsedInForm from '../components/BreadcrumbUsedInForm';

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
    <div className="form-22-10216-container row">
      <div className="desktop-lg:vads-u-padding-left--0 vads-u-padding-left--2">
        <BreadcrumbUsedInForm />
      </div>
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
