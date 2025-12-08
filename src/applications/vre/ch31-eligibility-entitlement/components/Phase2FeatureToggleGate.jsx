import React from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

const Phase2FeatureToggleGate = ({ children, fallbackTitle }) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const showPage = useToggleValue(
    TOGGLE_NAMES.vre_eligibility_status_phase_2_updates,
  );

  if (!showPage) {
    return (
      <div className="row">
        <div className="usa-width-two-thirds vads-u-margin-top--0p5 vads-u-margin-x--1 medium-screen:vads-u-margin-x--0">
          <h1>{fallbackTitle}</h1>
          <p className="vads-u-color--gray-medium">
            This page isn’t available right now.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default Phase2FeatureToggleGate;
