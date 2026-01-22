import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import { TRAVEL_PAY_FILE_NEW_CLAIM_ENTRY } from '@department-of-veterans-affairs/mhv/exports';
import { getDaysRemainingToFileClaim } from '../utils/appointment';
import {
  selectAppointmentTravelClaim,
  selectIsEligibleForTravelClaim,
} from '../appointment-list/redux/selectors';
import { TRAVEL_CLAIM_MESSAGES } from '../utils/constants';
import Section from './Section';

const setClaimEntry = () => {
  sessionStorage.setItem(
    TRAVEL_PAY_FILE_NEW_CLAIM_ENTRY.SESSION_KEY,
    TRAVEL_PAY_FILE_NEW_CLAIM_ENTRY.ENTRY_TYPES.APPOINTMENT,
  );
};

export default function TravelReimbursementSection({ appointment }) {
  const [showModal, setShowModal] = useState(false);
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const complexClaimsEnabled = useToggleValue(
    TOGGLE_NAMES.travelPayEnableComplexClaims,
  );

  const isEligibleForTravelClaim = selectIsEligibleForTravelClaim(appointment);
  if (!isEligibleForTravelClaim) return null;

  const claimData = selectAppointmentTravelClaim(appointment);
  if (!claimData.metadata.success) return null;

  const daysRemainingToFileClaim = getDaysRemainingToFileClaim(
    appointment.start,
  );
  const heading = 'Travel reimbursement';

  const isClaimInProgress =
    claimData.claim?.claimStatus === 'Incomplete' ||
    claimData.claim?.claimStatus === 'Saved';

  if (
    (claimData.metadata.message === TRAVEL_CLAIM_MESSAGES.noClaim ||
      (claimData.metadata.message === TRAVEL_CLAIM_MESSAGES.success &&
        !claimData.claim)) &&
    daysRemainingToFileClaim > 0
  ) {
    return (
      <Section heading={heading}>
        <p className="vads-u-margin-y--0p5 vads-u-margin-bottom--1">
          Days left to file: {daysRemainingToFileClaim}
        </p>
        <p className="vads-u-margin-y--0p5 vads-u-margin-bottom--2">
          <va-link
            data-testid="file-claim-link"
            className="vads-u-margin-y--0p5"
            href={`/my-health/travel-pay/file-new-claim/${appointment.id}`}
            onClick={setClaimEntry}
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
          <p className="vads-u-margin-y--0p5 vads-u-margin-bottom--1">
            Days left to file: {daysRemainingToFileClaim}
          </p>
          <p className="vads-u-margin-y--0p5 vads-u-margin-bottom--2">
            You didn’t file a claim for this appointment within the 30-day
            limit. You can still review and file your claim. But claims filed
            after 30 days are usually denied.
          </p>
          <p className="vads-u-margin-y--0p5">
            <va-link
              data-testid="file-claim-link"
              className="vads-u-margin-y--0p5"
              href={`/my-health/travel-pay/file-new-claim/${appointment.id}`}
              onClick={setClaimEntry}
              text="File a travel reimbursement claim"
            />
          </p>
        </Section>
      </>
    );
  }

  // Has claim
  if (claimData.metadata.status === 200 && claimData.claim?.id) {
    // Has unfinished claim
    if (complexClaimsEnabled && isClaimInProgress) {
      // Unfinished claim for appointment >30 days old
      if (daysRemainingToFileClaim < 1) {
        return (
          <>
            <Section heading={heading}>
              <p className="vads-u-margin-y--0p5 vads-u-margin-bottom--1">
                Days left to file: {daysRemainingToFileClaim}
              </p>
              <p className="vads-u-margin-y--0p5 vads-u-margin-bottom--2">
                You didn’t file a claim for this appointment within the 30-day
                limit. You can still review and file your claim. But claims
                filed after 30 days are usually denied.
              </p>
              <p className="vads-u-margin-y--0p5">
                <va-link
                  data-testid="view-claim-link"
                  onClick={() => setShowModal(true)}
                  text="Complete and file your claim"
                />
              </p>
            </Section>
            <VaModal
              visible={showModal}
              onCloseEvent={() => setShowModal(false)}
              onPrimaryButtonClick={() => {
                setShowModal(false);
                setClaimEntry();
                window.location.href = `/my-health/travel-pay/claims/${
                  claimData.claim.id
                }`;
              }}
              onSecondaryButtonClick={() => setShowModal(false)}
              modalTitle="Your appointment happened more than 30 days ago"
              primaryButtonText="File claim"
              secondaryButtonText="Don’t file"
              status="warning"
              uswds
            >
              <p>
                You can still review and file your claim. But claims filed after
                30 days are usually denied.
              </p>
              <p>Do you still want to file a travel reimbursement claim?</p>
            </VaModal>
          </>
        );
      }

      // Unfinished claim for appointment within 30 days
      return (
        <Section heading={heading}>
          <p className="vads-u-margin-y--0p5 vads-u-margin-bottom--1">
            Days left to file: {daysRemainingToFileClaim}
          </p>
          <p className="vads-u-margin-y--0p5 vads-u-margin-bottom--2">
            You already started a claim for this appointment. Add your expenses
            and file within 30 days days of your appointment date.
          </p>
          <p className="vads-u-margin-y--0p5">
            <va-link
              data-testid="view-claim-link"
              href={`/my-health/travel-pay/claims/${claimData.claim.id}`}
              onClick={setClaimEntry}
              text="Complete and file your claim"
            />
          </p>
        </Section>
      );
    }

    // Finished claim
    return (
      <Section heading={heading}>
        <p className="vads-u-margin-y--0p5 vads-u-margin-bottom--2">
          You’ve already filed a claim for this appointment.
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
