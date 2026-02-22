import React from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import VeteranStatus from './VeteranStatus';
import VeteranStatusSharedService from './VeteranStatusSharedService';

/**
 * Wrapper component that toggles between the old VeteranStatus component
 * and the new VeteranStatusSharedService component based on a feature toggle.
 *
 * Feature toggle: cveVeteranStatusNewService
 * - When enabled (true): renders VeteranStatusSharedService (new API: /v0/veteran_status_card)
 * - When disabled (false): renders VeteranStatus (old API: /profile/vet_verification_status)
 */
const VeteranStatusWrapper = props => {
  const {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
  } = useFeatureToggle();

  const isLoading = useToggleLoadingValue();
  const useSharedService = useToggleValue(
    TOGGLE_NAMES.profileUseSharedVetranStatusService,
  );

  // Show loading indicator while feature toggles are loading
  if (isLoading) {
    return (
      <va-loading-indicator
        set-focus
        message="Loading..."
        data-testid="veteran-status-wrapper-loading"
      />
    );
  }

  // Render the appropriate component based on the feature toggle
  if (useSharedService) {
    return <VeteranStatusSharedService {...props} />;
  }

  return <VeteranStatus {...props} />;
};

export default VeteranStatusWrapper;
