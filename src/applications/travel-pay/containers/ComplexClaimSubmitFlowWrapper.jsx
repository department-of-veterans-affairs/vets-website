import React from 'react';
import { useParams, Outlet } from 'react-router-dom-v5-compat';

import { Element } from 'platform/utilities/scroll';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';

const ComplexClaimSubmitFlowWrapper = () => {
  const { apptId } = useParams();
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const complexClaimsEnabled = useToggleValue(
    TOGGLE_NAMES.travelPayEnableComplexClaims,
  );

  // If feature flag is disabled, redirect to home
  if (!complexClaimsEnabled) {
    window.location.replace('/');
    return null;
  }

  return (
    <Element name="topScrollElement">
      <article className="usa-grid-full vads-u-margin-bottom--0">
        <div className="vads-u-padding-top--2p5 vads-u-padding-bottom--4">
          <va-link
            back
            data-testid="complex-claim-back-link"
            disable-analytics
            href={`/my-health/appointments/past/${apptId}`}
            text="Back to your appointment"
          />
        </div>
        <div className="vads-l-col--12 medium-screen:vads-l-col--8">
          <Outlet />
        </div>
      </article>
    </Element>
  );
};

export default ComplexClaimSubmitFlowWrapper;
