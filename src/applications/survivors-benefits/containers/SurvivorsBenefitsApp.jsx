import React from 'react';
import PropTypes from 'prop-types';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import IntentToFile from 'platform/shared/itf/IntentToFile';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';

export default function SurvivorsBenefitsApp({ location, children }) {
  const TOGGLE_KEY = 'survivorsBenefitsForm2025VersionEnabled';
  const { useFormFeatureToggleSync } = useFeatureToggle();
  useFormFeatureToggleSync([
    {
      toggleName: TOGGLE_KEY,
      formKey: 'form2025Version',
    },
  ]);

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      <IntentToFile itfType="pension" location={location} disableAutoFocus />
      {children}
    </RoutedSavableApp>
  );
}

SurvivorsBenefitsApp.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};
