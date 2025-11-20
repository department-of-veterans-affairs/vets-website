import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { getDaysRemainingToFileClaim } from '../utils/appointment';
import {
  selectAppointmentTravelClaim,
  selectIsEligibleForTravelClaim,
} from '../appointment-list/redux/selectors';
import { TRAVEL_CLAIM_MESSAGES } from '../utils/constants';
import Section from './Section';

export default function TravelReimbursementSection({ appointment }) {
  const [showModal, setShowModal] = useState(false);

  const isEligibleForTravelClaim = selectIsEligibleForTravelClaim(appointment);
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
      <>
        <Section heading={heading}>
          <p className="vads-u-margin-y--0p5">
            Days left to file: {daysRemainingToFileClaim}
          </p>
          <p className="vads-u-margin-y--0p5">
            You didn’t file a claim for this appointment within the 30-day
            limit. You can still review and file your claim. But claims filed
            after 30 days are usually denied.
          </p>
          <p className="vads-u-margin-y--0p5">
            <va-link
              data-testid="file-claim-link"
              className="vads-u-margin-y--0p5"
              onClick={() => setShowModal(true)}
              text="File a travel reimbursement claim"
            />
          </p>
        </Section>
        <VaModal
          visible={showModal}
          onCloseEvent={() => setShowModal(false)}
          onPrimaryButtonClick={() => {
            setShowModal(false);
            window.location.href = `/my-health/travel-pay/file-new-claim/${
              appointment.id
            }`;
          }}
          onSecondaryButtonClick={() => setShowModal(false)}
          modalTitle="Your appointment happened more than 30 days ago"
          primaryButtonText="Yes, I want to file"
          secondaryButtonText="Don’t file"
          status="warning"
          uswds
        >
          <p>
            You can still review and file your claim. But claims filed after 30
            days are usually denied.
          </p>
          <p>Do you still want to file a travel reimbursement claim?</p>
        </VaModal>
      </>
    );
  }
  if (claimData.metadata.status === 200 && claimData.claim?.id) {
    if (
      claimData.claim.claimStatus === 'Saved' ||
      claimData.claim.claimStatus === 'Incomplete'
    ) {
      return (
        <Section heading={heading}>
          <p className="vads-u-margin-y--0p5">
            You already started a claim for this appointment. Add your expenses
            and file within 30 days days of your appointment date.
          </p>
          <p className="vads-u-margin-y--0p5">
            <va-link
              data-testid="view-claim-link"
              href={`/my-health/travel-pay/file-new-claim/${appointment.id}`}
              text="Complete and file your claim"
            />
          </p>
        </Section>
      );
    }

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
