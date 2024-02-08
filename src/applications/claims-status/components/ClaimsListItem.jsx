import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import { getClaimType } from '../utils/helpers';

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

const formatDate = date => moment(date).format('MMMM D, YYYY');

const getTitle = claim => {
  const claimType = getClaimType(claim).toLowerCase();
  const updatedOn = formatDate(
    claim.attributes.claimPhaseDates?.phaseChangeDate,
  );

  return `Claim for ${claimType}\n updated on ${updatedOn}`;
};

const isClaimComplete = claim => {
  const { decisionLetterSent, status } = claim.attributes;

  return decisionLetterSent || status === 'COMPLETE';
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
  const {
    claimDate,
    decisionLetterSent,
    developmentLetterSent,
    documentsNeeded,
    status,
  } = claim.attributes;
  const inProgress = !isClaimComplete(claim);
  const formattedReceiptDate = formatDate(claimDate);
  const humanStatus = getStatusDescription(status);

  return (
    <div className="claim-list-item-container">
      <h3 className="claim-list-item-header-v2">{getTitle(claim)}</h3>
      {humanStatus && (
        <div className="card-status">
          <div
            className={`status-circle ${
              status === 'COMPLETE' ? 'closed-claim' : 'open-claim'
            }`}
          />
          <p>
            <strong>Status:</strong> {humanStatus}
          </p>
        </div>
      )}
      <ul className="communications">
        {inProgress && developmentLetterSent ? (
          <CommunicationsItem icon="envelope">
            We sent you a development letter
          </CommunicationsItem>
        ) : null}
        {decisionLetterSent && (
          <CommunicationsItem icon="envelope">
            You have a decision letter ready
          </CommunicationsItem>
        )}
        {inProgress && documentsNeeded ? (
          <CommunicationsItem icon="exclamation-triangle">
            Items need attention
          </CommunicationsItem>
        ) : null}
      </ul>
      <div className="card-status">
        <p>
          <strong>Received on:</strong> {formattedReceiptDate}
        </p>
      </div>
      <Link
        aria-label={`View details of claim received ${formattedReceiptDate}`}
        className="vads-c-action-link--blue"
        to={`your-claims/${claim.id}/status`}
      >
        View details
      </Link>
    </div>
  );
}

ClaimsListItem.propTypes = {
  claim: PropTypes.object,
};
