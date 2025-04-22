import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectAppointmentTravelClaim,
  selectIsEligibleForTravelClaim,
} from '../appointment-list/redux/selectors';
import { selectFeatureFeSourceOfTruthModality } from '../redux/selectors';
import { getDaysRemainingToFileClaim } from '../utils/appointment';
import { TRAVEL_CLAIM_MESSAGES } from '../utils/constants';
import Section from './Section';

export default function TravelReimbursementSection({ appointment }) {
  const useFeSourceOfTruthModality = useSelector(state =>
    selectFeatureFeSourceOfTruthModality(state),
  );
  const isEligibleForTravelClaim = selectIsEligibleForTravelClaim(
    appointment,
    useFeSourceOfTruthModality,
  );
  if (!isEligibleForTravelClaim) return null;

  const claimData = selectAppointmentTravelClaim(appointment);
  if (!claimData.metadata.success) return null;

  const daysRemainingToFileClaim = getDaysRemainingToFileClaim(
    appointment.start,
  );
  const heading = 'Travel reimbursement';

  if (
    (claimData.metadata.message === TRAVEL_CLAIM_MESSAGES.noClaim ||
      (claimData.metadata.message === TRAVEL_CLAIM_MESSAGES.success &&
        !claimData.claim)) &&
    daysRemainingToFileClaim > 0
  ) {
    return (
      <Section heading={heading}>
        <p className="vads-u-margin-y--0p5">
          Days left to file: {daysRemainingToFileClaim}
        </p>
        <p className="vads-u-margin-y--0p5">
          <va-link
            data-testid="file-claim-link"
            className="vads-u-margin-y--0p5"
            href={`/my-health/travel-pay/file-new-claim/${appointment.id}`}
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
            href={`/my-health/travel-pay/claims/${claimData.claim.id}`}
            text="Check your claim status"
          />
        </p>
      </Section>
    );
  }

  return null;
}

TravelReimbursementSection.propTypes = {
  appointment: PropTypes.object,
};
