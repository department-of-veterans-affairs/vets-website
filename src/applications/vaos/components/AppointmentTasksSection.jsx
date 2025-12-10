import React from 'react';
import PropTypes from 'prop-types';

import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';

import { getDaysRemainingToFileClaim } from '../utils/appointment';
import {
  selectAppointmentTravelClaim,
  selectIsEligibleForTravelClaim,
} from '../appointment-list/redux/selectors';
import Section from './Section';

export default function AppointmentTasksSection({ appointment }) {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const complexClaimsEnabled = useToggleValue(
    TOGGLE_NAMES.travelPayEnableComplexClaims,
  );
  const isEligibleForTravelClaim = selectIsEligibleForTravelClaim(appointment);
  if (!isEligibleForTravelClaim) return null;

  const claimData = selectAppointmentTravelClaim(appointment);
  const isClaimInProgress =
    claimData?.claim?.claimStatus === 'Incomplete' ||
    claimData?.claim?.claimStatus === 'Saved';

  // if the claim data is not successful or the claim has already been filed, don't show the link to file a claim
  if (
    !claimData.metadata.success ||
    (claimData.metadata.success &&
      claimData.claim &&
      (!complexClaimsEnabled || !isClaimInProgress))
  )
    return null;

  const daysRemainingToFileClaim = getDaysRemainingToFileClaim(
    appointment.start,
  );
  if (daysRemainingToFileClaim < 1) return null;

  return (
    <Section heading="Appointment tasks">
      <va-link-action
        data-testid="file-claim-link"
        className="vads-u-margin-top--1"
        href={`/my-health/travel-pay/file-new-claim/${appointment.id}`}
        text={
          isClaimInProgress
            ? 'Complete your travel reimbursement claim'
            : 'File a travel reimbursement claim'
        }
      />
      <p
        className="vads-u-margin-top--0 vads-u-margin-bottom--1 vads-u-margin-left--4"
        data-testid="days-left-to-file"
      >
        Days left to file: {daysRemainingToFileClaim}
      </p>
    </Section>
  );
}

AppointmentTasksSection.propTypes = {
  appointment: PropTypes.object,
};
