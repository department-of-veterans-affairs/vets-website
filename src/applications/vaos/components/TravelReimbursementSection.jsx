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
            You didn’t file a claim for this appointment within the 30 day
            limit. You can still review and submit your claim. But claims
            submitted after 30 days are usually denied.
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
          modalTitle="Filing after 30 days"
          primaryButtonText="Yes, I want to file"
          secondaryButtonText="No, I won't file"
          status="warning"
          uswds
        >
          <p>
            You can still review and submit your claim. But claims submitted
            after 30 days are usually denied.
          </p>
          <p>Do you still want to file a travel claim?</p>
        </VaModal>
      </>
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
