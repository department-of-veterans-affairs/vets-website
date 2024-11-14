import React from 'react';
import PropTypes from 'prop-types';
import { getDaysRemainingToFileClaim } from '../utils/appointment';
import {
  selectAppointmentTravelClaim,
  selectIsPast,
  selectIsClinicVideo,
  selectIsInPerson,
} from '../appointment-list/redux/selectors';
import { TRAVEL_CLAIM_MESSAGES } from '../utils/constants';
import Section from './Section';

export default function TravelReimbursement({ appointment }) {
  const isPastAppointment = selectIsPast(appointment);
  if (!isPastAppointment) {
    return null;
  }

  const isInPerson = selectIsInPerson(appointment);
  const isClinicVideo = selectIsClinicVideo(appointment);
  // If it's not an in-person appointment or a clinic video appointment, don't show the link to file a claim
  if (!isInPerson && !isClinicVideo) return null;

  const claimData = selectAppointmentTravelClaim(appointment);
  if (!claimData) {
    return null;
  }

  const daysRemainingToFileClaim = getDaysRemainingToFileClaim(
    appointment.start,
  );
  const heading = 'Travel reimbursement';

  if (claimData.metadata.status !== 200) {
    return (
      <Section heading={heading}>
        <p className="vads-u-margin-y--0p5">
          We’re sorry. Something went wrong on our end. Please try again later.
        </p>
      </Section>
    );
  }

  if (
    (claimData.metadata.message === TRAVEL_CLAIM_MESSAGES.noClaim ||
      (claimData.metadata.message === TRAVEL_CLAIM_MESSAGES.success &&
        !claimData.claim)) &&
    daysRemainingToFileClaim > 0
  ) {
    // TODO: change the link for submitting a travel claim once it's available
    return (
      <Section heading={heading}>
        <p className="vads-u-margin-y--0p5">
          Days left to file: {daysRemainingToFileClaim}
        </p>
        <p className="vads-u-margin-y--0p5">
          <va-link
            data-testid="file-claim-link"
            className="vads-u-margin-y--0p5"
            href={`/appointments/claims/?date=${appointment.start}`}
            text="File a travel reimbursement claim"
          />
        </p>
      </Section>
    );
  }
  if (
    (claimData.metadata.message === TRAVEL_CLAIM_MESSAGES.noClaim ||
      (claimData.metadata.message === TRAVEL_CLAIM_MESSAGES.success &&
        !claimData.claim)) &&
    daysRemainingToFileClaim < 1
  ) {
    return (
      <Section heading={heading}>
        <p className="vads-u-margin-y--0p5">
          Days left to file: {daysRemainingToFileClaim}
        </p>
        <p className="vads-u-margin-y--0p5">
          You didn’t file a claim for this appointment. You can only file for
          reimbursement within 30 days of the appointment.
        </p>
        <p className="vads-u-margin-y--0p5">
          <va-link
            data-testid="how-to-file-claim-link"
            className="vads-u-margin-y--0p5"
            href="https://www.va.gov/resources/how-to-file-a-va-travel-reimbursement-claim-online/"
            text="Learn more about travel reimbursement"
          />
        </p>
      </Section>
    );
  }
  if (claimData.metadata.status === 200 && claimData.claim?.id) {
    return (
      <Section heading={heading}>
        <p className="vads-u-margin-y--0p5">
          You've already filed a claim for this appointment.
        </p>
        <p className="vads-u-margin-y--0p5">
          <va-link
            data-testid="view-claim-link"
            href={`/my-health/travel-claim-status/${claimData.claim.id}`}
            text="Check your claim status"
          />
        </p>
      </Section>
    );
  }

  return null;
}

TravelReimbursement.propTypes = {
  appointment: PropTypes.object,
};
