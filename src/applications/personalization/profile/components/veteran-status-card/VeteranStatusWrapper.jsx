import React from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import VeteranStatus from './VeteranStatus';

/**
 * Wrapper component that toggles between the old VeteranStatus component
 * and the new VeteranStatusSharedService component based on a feature toggle.
 *
 * Feature toggle: cveVeteranStatusNewService
 * - When enabled (true): renders VeteranStatusSharedService (new API: /v0/veteran_status_card)
 * - When disabled (false): renders VeteranStatus (old API: /profile/vet_verification_status)
 *
 * TODO: Import and render VeteranStatusSharedService when feature toggle is enabled
 */
const VeteranStatusWrapper = props => {
  const { useToggleLoadingValue } = useFeatureToggle();

  const isLoading = useToggleLoadingValue();

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

  // TODO: Add feature toggle check to render VeteranStatusSharedService
  // when cveVeteranStatusNewService is enabled
  return <VeteranStatus {...props} />;
};

export default VeteranStatusWrapper;
