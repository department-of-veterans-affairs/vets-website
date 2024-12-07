import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import { addStyleToShadowDomOnPages } from '../utilities';

// export const isAccredited = val => val;
export default function App({ location, children }) {
  useEffect(() => {
    const label = document.querySelector(
      'label[id="root_studentRatioCalcChapter_studentPercentageCalc_calculatedPercentage-label"]',
    );
    if (label) {
      const parentDiv = label.closest('.schemaform-field-template');
      if (parentDiv) {
        parentDiv.remove(); // This will remove the specific parent div
      }
    }
    // Insert CSS to hide 'For example: January 19 2000' hint on memorable dates
    // (can't be overridden by passing 'hint' to uiOptions):
    addStyleToShadowDomOnPages(
      [''],
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
App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};
