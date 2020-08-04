import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

import {
  getPhaseDescription,
  isClaimComplete,
  getClaimType,
} from '../../utils/helpers';

function listPhase(phase) {
  return phase === 8 ? 'Closed' : getPhaseDescription(phase);
}

export default function ClaimsListItem({ claim }) {
  const inProgress = !isClaimComplete(claim);
  const formattedReceiptDate = moment(claim.attributes.dateFiled).format(
    'MMMM D, YYYY',
  );
  return (
    <div className="claim-list-item-container">
      <h2 className="claim-list-item-header-v2 vads-u-font-size--h3">
        Claim for {getClaimType(claim)}
        <br />
        updated on{' '}
        {moment(claim.attributes.phaseChangeDate).format('MMMM D, YYYY')}
      </h2>
      <div className="card-status">
        <div
          className={`status-circle ${
            claim.attributes.open ? 'open' : 'closed'
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
        {claim.attributes.decisionLetterSent ? (
          <li className="claim-list-item-text">
            <i className="fa fa-envelope claim-list-item-icon" />
            We sent you a decision letter
          </li>
        ) : null}
        {inProgress && claim.attributes.documentsNeeded ? (
          <li className="claim-list-item-text">
            <i className="fa fa-exclamation-triangle claim-list-item-icon" />
            Items need attention
          </li>
        ) : null}
      </ul>
      <div className="card-status">
        <p>
          <strong>Submitted on:</strong> {formattedReceiptDate}
        </p>
      </div>
      <Link
        aria-label={`View details of claim received ${formattedReceiptDate}`}
        className="usa-button usa-button-primary"
        to={`your-claims/${claim.id}/status`}
      >
        View details
        <i className="fa fa-chevron-right" />
      </Link>
    </div>
  );
}

ClaimsListItem.propTypes = {
  claim: PropTypes.object,
};
