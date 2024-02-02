import React from 'react';
import PropTypes from 'prop-types';

import { getClaimType, buildDateFormatter } from '../utils/helpers';
import ClaimCard from './ClaimCard';

const statusMap = {
  CLAIM_RECEIVED: 'Step 1 of 5: Claim received',
  INITIAL_REVIEW: 'Step 2 of 5: Initial review',
  EVIDENCE_GATHERING_REVIEW_DECISION:
    'Step 3 of 5: Evidence gathering, review, and decision',
  PREPARATION_FOR_NOTIFICATION: 'Step 4 of 5: Preparation for notification',
  COMPLETE: 'Step 5 of 5: Closed',
};

function getStatusDescription(status) {
  return statusMap[status];
}

const formatDate = date => buildDateFormatter('MMMM d, yyyy')(date);

const getTitle = claim => {
  return `Claim for ${getClaimType(claim).toLowerCase()}`;
};

const getLastUpdated = claim => {
  const updatedOn = formatDate(
    claim.attributes.claimPhaseDates?.phaseChangeDate,
  );

  return `Last updated: ${updatedOn}`;
};

const showPreDecisionCommunications = claim => {
  const { decisionLetterSent, status } = claim.attributes;

  return !decisionLetterSent && status !== 'COMPLETE';
};

const isClaimComplete = claim => claim.attributes.status === 'COMPLETE';

const CommunicationsItem = ({ children, icon }) => {
  return (
    <li className="vads-u-margin--0">
      <i
        className={`fa fa-${icon} vads-u-margin-right--1`}
        aria-hidden="true"
      />
      {children}
    </li>
  );
};

export default function ClaimsListItemV3({ claim }) {
  const {
    claimDate,
    decisionLetterSent,
    developmentLetterSent,
    documentsNeeded,
    status,
  } = claim.attributes;
  const inProgress = !isClaimComplete(claim);
  const showPrecomms = showPreDecisionCommunications(claim);
  const formattedReceiptDate = formatDate(claimDate);
  const humanStatus = getStatusDescription(status);
  const showAlert = showPrecomms && documentsNeeded;

  const ariaLabel = `View details for claim submitted on ${formattedReceiptDate}`;
  const href = `your-claims/${claim.id}/status`;

  return (
    <ClaimCard
      title={getTitle(claim)}
      label={inProgress ? 'In Progress' : null}
      subtitle={`Received on ${formattedReceiptDate}`}
    >
      <ul className="communications">
        {showPrecomms && developmentLetterSent ? (
          <CommunicationsItem icon="envelope">
            We sent you a development letter
          </CommunicationsItem>
        ) : null}
        {decisionLetterSent && (
          <CommunicationsItem icon="envelope">
            You have a decision letter ready
          </CommunicationsItem>
        )}
      </ul>
      <div className="card-status">
        {humanStatus && <p>{humanStatus}</p>}
        <p>{getLastUpdated(claim)}</p>
      </div>
      {showAlert && (
        <va-alert status="warning" slim uswds>
          An item in the claim needs your attention
        </va-alert>
      )}
      <ClaimCard.Link ariaLabel={ariaLabel} href={href} />
    </ClaimCard>
  );
}

ClaimsListItemV3.propTypes = {
  claim: PropTypes.object,
};
