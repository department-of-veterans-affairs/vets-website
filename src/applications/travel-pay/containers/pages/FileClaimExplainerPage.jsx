import React from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';

const FileClaimExplainerPage = () => {
  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const toggleIsLoading = useToggleLoadingValue();
  const canSubmitMileage = useToggleValue(
    TOGGLE_NAMES.travelPaySubmitMileageExpense,
  );

  if (toggleIsLoading) {
    return (
      <div className="vads-l-grid-container vads-u-padding-y--3">
        <va-loading-indicator
          label="Loading"
          message="Please wait while we load the application for you."
          data-testid="travel-pay-loading-indicator"
        />
      </div>
    );
  }

  if (!canSubmitMileage) {
    window.location.replace('/');
    return null;
  }

  return (
    <article className="usa-grid-full vads-u-margin-y--3">
      <div className="vads-l-col--12 medium-screen:vads-l-col--8">
        <h1>How to file a claim</h1>
      </div>
    </article>
  );
};

export default FileClaimExplainerPage;
