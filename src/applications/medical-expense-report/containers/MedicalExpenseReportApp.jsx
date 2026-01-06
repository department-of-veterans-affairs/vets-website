import React from 'react';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
// Re-enable when needed.
// import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import IntentToFile from 'platform/shared/itf/IntentToFile';
import formConfig from '../config/form';

export default function MedicalExpenseReportApp({ location, children }) {
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      <IntentToFile itfType="pension" location={location} disableAutoFocus />
      {children}
    </RoutedSavableApp>
  );
}

MedicalExpenseReportApp.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};
