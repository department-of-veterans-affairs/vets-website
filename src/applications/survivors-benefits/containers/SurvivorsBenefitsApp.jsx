import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import { addStyleToShadowDomOnPages } from '../utils/helpers';

export default function SurvivorsBenefitsApp({ location, children }) {
  useEffect(() => {
    // Insert CSS to hide 'For example: January 19 2000' hint on memorable dates
    // (can't be overridden by passing 'hint' to uiOptions):
    addStyleToShadowDomOnPages(
      ['veteran/service-period', 'veteran/prisoner-of-war-period'],
      ['va-memorable-date'],
      '#dateHint {display: none}',
    );
  });

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

SurvivorsBenefitsApp.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};
