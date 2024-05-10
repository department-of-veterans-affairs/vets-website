import React from 'react';
import { Outlet } from 'react-router-dom-v5-compat';

import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import NotInPilotError from '../components/NotInPilotError/NotInPilotError';

const InPilotCheck = () => {
  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const isInPilot = useToggleValue(
    TOGGLE_NAMES.accreditedRepresentativePortalPilot,
  );
  const isToggleLoading = useToggleLoadingValue();

  if (isToggleLoading) {
    return (
      <div className="vads-u-margin-y--5">
        <VaLoadingIndicator />
      </div>
    );
  }

  if (!isInPilot && environment.isProduction()) {
    return <NotInPilotError />;
  }

  return <Outlet />;
};

export default InPilotCheck;
