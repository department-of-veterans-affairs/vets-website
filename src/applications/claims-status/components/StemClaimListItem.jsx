import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import recordEvent from 'platform/monitoring/record-event';

export default function StemClaimListItem({ claim }) {
  if (!claim.attributes.automatedDenial) {
    return null;
  }
  const formattedDeniedAtDate = moment(claim.attributes.deniedAt).format(
    'MMMM D, YYYY',
  );
  const formattedReceiptDate = moment(claim.attributes.submittedAt).format(
    'MMMM D, YYYY',
  );

  const handlers = {
    openClaimClick: () =>
      recordEvent({
        event: 'cta-action-link-click',
        'action-link-type': 'secondary',
        'action-link-click-label': 'View details',
        'action-link-icon-color': 'blue',
        'claim-type': 'STEM Scholarship',
        'claim-last-updated-date': formattedDeniedAtDate,
        'claim-submitted-date': formattedDeniedAtDate,
        'claim-status': 'Denied',
      }),
  };

  return (
    <div className="claim-list-item-container">
      <h2 className="claim-list-item-header-v2 vads-u-font-size--h3">
        Edith Nourse Rogers STEM Scholarship application
        <br />
        updated on {formattedDeniedAtDate}
      </h2>
      <div className="card-status">
        <div className="status-circle closed-claim" />
        <p>
          <strong>Status:</strong> Denied
        </p>
      </div>
      <div className="card-status">
        <p>
          <strong>Received on:</strong> {formattedReceiptDate}
        </p>
      </div>
      <Link
        aria-label={`View details of claim received ${formattedReceiptDate}`}
        className="vads-c-action-link--blue"
        to={`your-stem-claims/${claim.id}/status`}
        onClick={handlers.openClaimClick}
      >
        View details
      </Link>
    </div>
  );
}

StemClaimListItem.propTypes = {
  claim: PropTypes.object,
};
