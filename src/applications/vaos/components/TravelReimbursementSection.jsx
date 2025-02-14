import React from 'react';
import PropTypes from 'prop-types';
import {
  selectAppointmentTravelClaim,
  selectIsEligibleForTravelClaim,
} from '../appointment-list/redux/selectors';
import { TRAVEL_CLAIM_MESSAGES } from '../utils/constants';
import Section from './Section';

export default function TravelReimbursementSection({ appointment }) {
  const isEligibleForTravelClaim = selectIsEligibleForTravelClaim(appointment);
  if (!isEligibleForTravelClaim) return null;

  const claimData = selectAppointmentTravelClaim(appointment);
  if (!claimData.metadata.success) return null;

  const heading = 'Travel reimbursement';

  if (
    claimData.metadata.message === TRAVEL_CLAIM_MESSAGES.noClaim ||
    (claimData.metadata.message === TRAVEL_CLAIM_MESSAGES.success &&
      !claimData.claim)
  ) {
    return (
      <Section heading={heading}>
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
    claimData.metadata.message === TRAVEL_CLAIM_MESSAGES.noClaim ||
    (claimData.metadata.message === TRAVEL_CLAIM_MESSAGES.success &&
      !claimData.claim)
  ) {
    return (
      <Section heading={heading}>
        <p className="vads-u-margin-y--0p5">
          You didn’t file a claim for this appointment.
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
