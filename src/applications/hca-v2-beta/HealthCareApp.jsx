import React from 'react';

import RoutedSavableApp from '../../platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from './config/form';

import BetaApp from 'applications/beta-enrollment/containers/BetaApp';
import { features } from 'applications/beta-enrollment/routes';

export default function HealthCareEntry({ location, children }) {
  return (
    <BetaApp featureName={features.hca2} redirect="/beta-enrollment/hca/">
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </BetaApp>
  );
}
