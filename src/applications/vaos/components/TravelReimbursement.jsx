import React from 'react';
import PropTypes from 'prop-types';
import { getDaysRemainingToFileClaim } from '../utils/appointment';
import {
  selectAppointmentTravelClaim,
  selectIsPast,
} from '../appointment-list/redux/selectors';
import { TRAVEL_CLAIM_MESSAGES } from '../utils/constants';

export function TravelReimbursement({ appointment }) {
  const isPastAppointment = selectIsPast(appointment);
  if (!isPastAppointment) {
    return null;
  }

  const claimData = selectAppointmentTravelClaim(appointment);
  if (!claimData) {
    return null;
  }

  const daysRemainingToFileClaim = getDaysRemainingToFileClaim(
    appointment.start,
  );
  const heading = (
    <h2 className="vads-u-font-size--h5 vads-u-margin-bottom--0">
      Travel reimbursement
    </h2>
  );

  if (claimData.metadata.status !== '200') {
    return (
      <>
        {heading}
        <p className="vads-u-margin-y--0p5">
          We’re sorry. Something went wrong on our end. Please try again later.
        </p>
      </>
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
      <>
        {heading}
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
      </>
    );
  }
  if (
    (claimData.metadata.message === TRAVEL_CLAIM_MESSAGES.noClaim ||
      (claimData.metadata.message === TRAVEL_CLAIM_MESSAGES.success &&
        !claimData.claim)) &&
    daysRemainingToFileClaim < 1
  ) {
    return (
      <>
        {heading}
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
      </>
    );
  }
  if (claimData.metadata.status === '200' && claimData.claim?.id) {
    return (
      <>
        {heading}
        <p className="vads-u-margin-y--0p5">
          You've already filed a claim for this facility and date.
        </p>
        <p className="vads-u-margin-y--0p5">
          <va-link
            data-testid="view-claim-link"
            href={`/my-health/travel-claim-status/${claimData.claim.id}`}
            text="Check your claim status"
          />
        </p>
      </>
    );
  }

  return null;
}

TravelReimbursement.propTypes = {
  appointment: PropTypes.object,
};
