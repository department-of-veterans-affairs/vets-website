import React from 'react';

import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import SignedInLayout from './SignedInLayout';

const SignedInLayoutWrapper = () => {
  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const isInPilot = useToggleValue(
    TOGGLE_NAMES.accreditedRepresentativePortalPilot,
  );
  const isPilotToggleLoading = useToggleLoadingValue();

  const isProduction = environment.isProduction();

  // TODO: Update with permissions check
  const hasPOAPermissions = true;

  return (
    <SignedInLayout
      isPilotToggleLoading={isPilotToggleLoading}
      isProduction={isProduction}
      isInPilot={isInPilot}
      hasPOAPermissions={hasPOAPermissions}
    />
  );
};

export default SignedInLayoutWrapper;
