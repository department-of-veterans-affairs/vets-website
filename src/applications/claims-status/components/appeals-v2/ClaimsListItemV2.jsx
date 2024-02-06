// lighthouse_migration
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import {
  getPhaseDescription,
  isClaimComplete,
  getClaimType,
} from '../../utils/helpers';

const listPhase = phase =>
  phase === 8 ? 'Closed' : getPhaseDescription(phase);

const getTitle = claim => {
  const claimType = getClaimType(claim).toLowerCase();
  const updatedOn = moment(claim.attributes.phaseChangeDate).format(
    'MMMM D, YYYY',
  );

  return `Claim for ${claimType}\n updated on ${updatedOn}`;
};

export default function ClaimsListItem({ claim }) {
  const inProgress = !isClaimComplete(claim);
  const formattedReceiptDate = moment(claim.attributes.dateFiled).format(
    'MMMM D, YYYY',
  );

  return (
    <div className="claim-list-item-container">
      <h3 className="claim-list-item-header-v2">{getTitle(claim)}</h3>
      <div className="card-status">
        <div
          className={`status-circle ${
            claim.attributes.open ? 'open-claim' : 'closed-claim'
          }`}
        />
        <p>
          <strong>Status:</strong> {listPhase(claim.attributes.phase)}
        </p>
      </div>
      <ul className="communications">
        {inProgress && claim.attributes.developmentLetterSent ? (
          <li className="claim-list-item-text">
            <i className="fa fa-envelope claim-list-item-icon" />
            We sent you a development letter
          </li>
        ) : null}
        {claim.attributes.decisionLetterSent && (
          <li className="claim-list-item-text">
            <i className="fa fa-envelope claim-list-item-icon" />
            You have a decision letter ready
          </li>
        )}
        {inProgress && claim.attributes.documentsNeeded ? (
          <li className="claim-list-item-text">
            <i className="fa fa-exclamation-triangle claim-list-item-icon" />
            Items need attention
          </li>
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
