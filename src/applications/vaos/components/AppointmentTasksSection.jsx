import React from 'react';
import PropTypes from 'prop-types';
import { getDaysRemainingToFileClaim } from '../utils/appointment';
import {
  selectAppointmentTravelClaim,
  selectIsEligibleForTravelClaim,
} from '../appointment-list/redux/selectors';
import Section from './Section';

export default function AppointmentTasksSection({ appointment }) {
  const isEligibleForTravelClaim = selectIsEligibleForTravelClaim(appointment);
  if (!isEligibleForTravelClaim) return null;

  const claimData = selectAppointmentTravelClaim(appointment);
  // if the claim data is not successful or the claim has already been filed, don't show the link to file a claim
  if (
    !claimData.metadata.success ||
    (claimData.metadata.success && claimData.claim)
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
        text="File a travel reimbursement claim"
      />
      <p className="vads-u-margin-top--0 vads-u-margin-bottom--1 vads-u-margin-left--4">
        Days left to file: {daysRemainingToFileClaim}
      </p>
    </Section>
  );
}

AppointmentTasksSection.propTypes = {
  appointment: PropTypes.object,
};
