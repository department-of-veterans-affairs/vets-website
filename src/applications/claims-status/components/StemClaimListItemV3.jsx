import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import recordEvent from 'platform/monitoring/record-event';

export default function StemClaimListItemV3({ claim }) {
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
    <va-card class="claim-list-item-container">
      <h3 className="claim-list-item-header vads-u-margin-bottom--2">
        Edith Nourse Rogers STEM Scholarship application
        <span className="submitted-on">
          Submitted on {formattedReceiptDate}
        </span>
      </h3>
      <div className="card-status">
        <p>Status: Denied</p>
        <p>Last updated on: {formattedDeniedAtDate}</p>
      </div>
      <va-link
        active
        aria-label={`View details for claim submitted on ${formattedReceiptDate}`}
        href={`your-stem-claims/${claim.id}/status`}
        text="View details"
        class="vads-u-margin-top--3 vads-u-display--block"
        onClick={handlers.openClaimClick}
      />
    </va-card>
  );
}

StemClaimListItemV3.propTypes = {
  claim: PropTypes.object,
};
