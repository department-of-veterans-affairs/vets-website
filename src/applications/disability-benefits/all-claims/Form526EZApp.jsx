import React from 'react';

import RoutedSavableApp from '../../../platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from './config/form';
import BetaApp from '../../beta-enrollment/containers/BetaApp';
import { features } from '../../beta-enrollment/routes';

import ITFWrapper from './containers/ITFWrapper';
import EVSSClaimsGate from './containers/EVSSClaimsGate';

export default function Form526Entry({ location, children }) {
  const content = (
    <EVSSClaimsGate location={location}>
      <ITFWrapper location={location}>
        <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
          {children}
        </RoutedSavableApp>
      </ITFWrapper>
    </EVSSClaimsGate>
  );

  // wraps the app and redirects user if they are not enrolled
  return (
    <BetaApp
      featureName={features.allClaims}
      redirect="/disability/how-to-file-claim/"
    >
      {content}
    </BetaApp>
  );
}
