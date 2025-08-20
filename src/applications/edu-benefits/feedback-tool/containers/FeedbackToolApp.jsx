import React from 'react';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

import formConfig from '../config/form';
import { useSetVetTecToggle } from '../hooks/useSetVetTecToggle';

export default function FeedbackToolApp({ location, children }) {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const showVetTecEduBenefit = useToggleValue(
    TOGGLE_NAMES.giFeedbackToolVetTecEducationBenefit,
  );

  useSetVetTecToggle(showVetTecEduBenefit);

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
