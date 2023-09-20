import PropTypes from 'prop-types';
import React from 'react';
import recordEvent from 'platform/monitoring/record-event';

import { buildDateFormatter } from '../utils/helpers';

export default function StemClaimListItemV3({ claim }) {
  if (!claim.attributes.automatedDenial) {
    return null;
  }
  const formattedDeniedAtDate = () =>
    buildDateFormatter('MMMM d, yyyy')(claim.attributes.deniedAt);
  const formattedReceiptDate = () =>
    buildDateFormatter('MMMM d, yyyy')(claim.attributes.submittedAt);

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
    <va-card class="claim-list-item">
      <h3 className="claim-list-item-header vads-u-margin-bottom--2">
        {/* eslint-disable-next-line jsx-a11y/aria-role */}
        <div role="text">
          Edith Nourse Rogers STEM Scholarship application
          <span>Submitted on {formattedReceiptDate}</span>
        </div>
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
        class="vads-u-margin-top--2 vads-u-display--block"
        onClick={handlers.openClaimClick}
      />
    </va-card>
  );
}

StemClaimListItemV3.propTypes = {
  claim: PropTypes.object,
};
