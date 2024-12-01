import React from 'react';
import PropTypes from 'prop-types';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

import {
  getClaimPhaseTypeHeaderText,
  buildDateFormatter,
  getStatusDescription,
  isDisabilityCompensationClaim,
  generateClaimTitle,
} from '../utils/helpers';
import ClaimCard from './ClaimCard';

const formatDate = buildDateFormatter();

const getLastUpdated = claim => {
  const updatedOn = formatDate(
    claim.attributes.claimPhaseDates?.phaseChangeDate,
  );

  return `Moved to this step on ${updatedOn}`;
};

const showPreDecisionCommunications = claim => {
  const { decisionLetterSent, status } = claim.attributes;

  return !decisionLetterSent && status !== 'COMPLETE';
};

const isClaimComplete = claim => claim.attributes.status === 'COMPLETE';

const CommunicationsItem = ({ children, icon }) => {
  return (
    <li className="vads-u-margin--0">
      <va-icon
        icon={icon}
        size={3}
        class="vads-u-margin-right--1"
        aria-hidden="true"
      />
      {children}
    </li>
  );
};

CommunicationsItem.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.string.isRequired,
};

export default function ClaimsListItem({ claim }) {
  const {
    claimDate,
    claimPhaseDates,
    claimTypeCode,
    decisionLetterSent,
    developmentLetterSent,
    documentsNeeded,
    status,
  } = claim.attributes;

  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const cstClaimPhasesEnabled = useToggleValue(TOGGLE_NAMES.cstClaimPhases);
  // When feature flag cstClaimPhases is enabled and claim type code is for a disability
  // compensation claim we show 8 phases instead of 5 with updated description, link text
  // and statuses
  const showEightPhases =
    cstClaimPhasesEnabled && isDisabilityCompensationClaim(claimTypeCode);

  const inProgress = !isClaimComplete(claim);
  const showPrecomms = showPreDecisionCommunications(claim);
  const formattedReceiptDate = formatDate(claimDate);
  const humanStatus = showEightPhases
    ? getClaimPhaseTypeHeaderText(claimPhaseDates.phaseType)
    : getStatusDescription(status);
  const showAlert = showPrecomms && documentsNeeded;

  const ariaLabel = `Details for claim submitted on ${formattedReceiptDate}`;
  const href = `/your-claims/${claim.id}/status`;

  return (
    <ClaimCard
      title={generateClaimTitle(claim)}
      label={inProgress ? 'In Progress' : null}
      subtitle={`Received on ${formattedReceiptDate}`}
    >
      <ul className="communications">
        {showPrecomms && developmentLetterSent ? (
          <CommunicationsItem icon="mail">
            We sent you a development letter
          </CommunicationsItem>
        ) : null}
        {decisionLetterSent && (
          <CommunicationsItem icon="mail">
            You have a decision letter ready
          </CommunicationsItem>
        )}
      </ul>
      <div className="card-status">
        {humanStatus && <p>{humanStatus}</p>}
        <p>{getLastUpdated(claim)}</p>
      </div>
      {showAlert && (
        <va-alert status="info" slim>
          <span className="vads-u-font-weight--bold">
            We requested more information from you:
          </span>{' '}
          Check the claim details to learn more.
          <div className="vads-u-margin-top--2">
            This message will go away when we finish reviewing your response.
          </div>
        </va-alert>
      )}
      <ClaimCard.Link ariaLabel={ariaLabel} href={href} />
    </ClaimCard>
  );
}

ClaimsListItem.propTypes = {
  claim: PropTypes.object,
};
