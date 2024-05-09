import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';
import { Outlet } from 'react-router-dom-v5-compat';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';

import NotInPilotError from '../components/NotInPilotError/NotInPilotError';

const InPilotCheckPage = () => {
  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const isInPilot = useToggleValue(
    TOGGLE_NAMES.accreditedRepresentativePortalPilot,
  );

  const toggleIsLoading = useToggleLoadingValue();

  if (toggleIsLoading) {
    return (
      <div className="vads-u-margin-y--5">
        <VaLoadingIndicator />
      </div>
    );
  }

  if (!isInPilot) {
    return <NotInPilotError />;
  }

  return <Outlet />;
};

export default InPilotCheckPage;
