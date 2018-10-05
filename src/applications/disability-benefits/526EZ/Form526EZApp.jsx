import React from 'react';

import RoutedSavableApp from '../../../platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from './config/form';

import ITFWrapper from '../all-claims/containers/ITFWrapper';
import DisabilityGate from './containers/DisabilityGate';
import EVSSClaimsGate from '../all-claims/containers/EVSSClaimsGate';

export default function Form526Entry({ location, children }) {
  return (
    <EVSSClaimsGate location={location}>
      <ITFWrapper location={location}>
        <DisabilityGate>
          {/*
              Skipping pre-fill because this will be re-mounted after ITFWrapper fetches the ITF data and
              mounting on the first page will cause RoutedSavableApp to fetch the in-progress form again.
          */}
          <RoutedSavableApp
            formConfig={formConfig}
            currentLocation={location}
            skipPrefill
          >
            {children}
          </RoutedSavableApp>
        </DisabilityGate>
      </ITFWrapper>
    </EVSSClaimsGate>
  );
}
