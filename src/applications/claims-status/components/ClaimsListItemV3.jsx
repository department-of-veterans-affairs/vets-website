import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import { getClaimType } from '../utils/helpers';

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

const formatDate = date => moment(date).format('MMMM D, YYYY');

const getTitle = claim => {
  return `Claim for ${getClaimType(claim)}`;
};

const getLastUpdated = claim => {
  const updatedOn = formatDate(
    claim.attributes.claimPhaseDates?.phaseChangeDate,
  );

  return `Last updated: ${updatedOn}`;
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

export default function ClaimsListItemV3({ claim }) {
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
  const showAlert = inProgress && documentsNeeded;

  return (
    <va-card class="claim-list-item">
      <h3 className="claim-list-item-header vads-u-margin-bottom--2">
        {/* eslint-disable-next-line jsx-a11y/aria-role */}
        <div role="text">
          {inProgress ? <span className="usa-label">In Progress</span> : ''}
          {getTitle(claim)}
          <span className="vads-u-margin-top--0p5">
            Submitted on {formattedReceiptDate}
          </span>
        </div>
      </h3>

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
      <va-link
        active
        aria-label={`View details for claim submitted on ${formattedReceiptDate}`}
        class="vads-u-margin-top--2 vads-u-display--block"
        href={`your-claims/${claim.id}/status`}
        text="View details"
      />
    </va-card>
  );
}

ClaimsListItemV3.propTypes = {
  claim: PropTypes.object,
};
