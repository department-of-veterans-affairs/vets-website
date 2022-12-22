import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

const statusMap = {
  CLAIM_RECEIVED: 'Claim received',
  INITIAL_REVIEW: 'Initial review',
  EVIDENCE_GATHERING_REVIEW_DECISION:
    'Evidence gathering, review, and decision',
  PREPARATION_FOR_NOTIFICATION: 'Preparation for notification',
  COMPLETE: 'Closed',
};

function getStatusDescription(status) {
  return statusMap[status];
}

const getClaimType = claim => {
  return (claim?.claimType || 'disability compensation').toLowerCase();
};

const getTitle = claim => {
  const updatedOn = moment(claim.claimPhaseDates.phaseChangeDate).format(
    'MMMM D, YYYY',
  );

  return `Claim for ${getClaimType(claim)}\n updated on ${updatedOn}`;
};

const isClaimComplete = claim => {
  return claim.decisionLetterSent || claim.status === 'COMPLETE';
};

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

export default function ClaimsListItem({ claim }) {
  const inProgress = !isClaimComplete(claim);
  const formattedReceiptDate = moment(claim.claimDate).format('MMMM D, YYYY');

  // lighthouse_migration: Remove `vads-u-border-left--7px` and `vads-u-border-color--primary`
  // CSS classes from `claim-list-item-container` element
  return (
    <div className="claim-list-item-container vads-u-border-left--7px vads-u-border-color--primary">
      <h3 className="claim-list-item-header-v2">{getTitle(claim)}</h3>
      <div className="card-status">
        <div
          className={`status-circle ${
            claim.status === 'COMPLETE' ? 'closed-claim' : 'open-claim'
          }`}
        />
        <p>
          <strong>Status:</strong> {getStatusDescription(claim.status)}
        </p>
      </div>
      <ul className="communications">
        {inProgress && claim.developmentLetterSent ? (
          <CommunicationsItem icon="envelope">
            We sent you a development letter
          </CommunicationsItem>
        ) : null}
        {claim.decisionLetterSent && (
          <CommunicationsItem icon="envelope">
            You have a decision letter ready
          </CommunicationsItem>
        )}
        {inProgress && claim.documentsNeeded ? (
          <CommunicationsItem icon="exclamation-triangle">
            Items need attention
          </CommunicationsItem>
        ) : null}
      </ul>
      <div className="card-status">
        <p>
          <strong>Submitted on:</strong> {formattedReceiptDate}
        </p>
      </div>
      <Link
        aria-label={`View details of claim received ${formattedReceiptDate}`}
        className="vads-c-action-link--blue"
        to={`your-claims/${claim.claimId}/status`}
      >
        View details
      </Link>
    </div>
  );
}

ClaimsListItem.propTypes = {
  claim: PropTypes.object,
};
