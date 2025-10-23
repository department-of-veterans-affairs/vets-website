import React from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from './config/form';
import EducationGate from '../containers/EducationGate';

export default function Form0994Entry({ location, children }) {
  return (
    <EducationGate location={location}>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </EducationGate>
  );
}
