import React from 'react';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import SignedInLayout from './SignedInLayout';

const SignedInLayoutWrapper = () => {
  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const isPilotToggleLoading = useToggleLoadingValue(
    TOGGLE_NAMES.accreditedRepresentativePortalPilot,
  );
  const isInPilot = useToggleValue(
    TOGGLE_NAMES.accreditedRepresentativePortalPilot,
  );
  const isProduction = window.Cypress || environment.isProduction();

  // TODO: Update with permissions check
  const hasPOAPermissions = true;
  return (
    <SignedInLayout
      isPilotToggleLoading={isPilotToggleLoading}
      isInPilot={isInPilot}
      isProduction={isProduction}
      hasPOAPermissions={hasPOAPermissions}
    />
  );
};

export default SignedInLayoutWrapper;
