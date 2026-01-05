import React from 'react';
import PropTypes from 'prop-types';

import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';

import { TRAVEL_PAY_FILE_NEW_CLAIM_ENTRY } from '@department-of-veterans-affairs/mhv/exports';
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
        href={
          isClaimInProgress
            ? `/my-health/travel-pay/claims/${claimData?.claim?.id}`
            : `/my-health/travel-pay/file-new-claim/${appointment.id}`
        }
        onClick={() => {
          sessionStorage.setItem(
            TRAVEL_PAY_FILE_NEW_CLAIM_ENTRY.SESSION_KEY,
            TRAVEL_PAY_FILE_NEW_CLAIM_ENTRY.ENTRY_TYPES.APPOINTMENT,
          );
        }}
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
