import React from 'react';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

import formConfig from '../config/form';

export default function FeedbackToolApp({ location, children }) {
  const { useFormFeatureToggleSync } = useFeatureToggle();
  useFormFeatureToggleSync([
    {
      toggleName: 'giFeedbackToolVetTecEducationBenefit', // feature toggle name
      formKey: 'view:giFeedbackToolVetTecEducationBenefit', // form data name
    },
  ]);

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      <div className="tool-app-wrapper">{children}</div>
    </RoutedSavableApp>
  );
}

FeedbackToolApp.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};
