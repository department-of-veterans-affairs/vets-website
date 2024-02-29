import React from 'react';
import PropTypes from 'prop-types';

import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import { buildDateFormatter } from '../utils/helpers';
import ClaimCard from './ClaimCard';

const formatDate = buildDateFormatter('MMMM d, yyyy');

export default function StemClaimListItem({ claim }) {
  if (!claim.attributes.automatedDenial) {
    return null;
  }

  const formattedDeniedAtDate = formatDate(claim.attributes.deniedAt);
  const formattedReceiptDate = formatDate(claim.attributes.submittedAt);

  const handlers = {
    onClick: () => {
      recordEvent({
        event: 'cta-action-link-click',
        'action-link-type': 'secondary',
        'action-link-click-label': 'View details',
        'action-link-icon-color': 'blue',
        'claim-type': 'STEM Scholarship',
        'claim-last-updated-date': formattedDeniedAtDate,
        'claim-submitted-date': formattedReceiptDate,
        'claim-status': 'Denied',
      });
    },
  };

  const ariaLabel = `View details for claim submitted on ${formattedReceiptDate}`;
  const href = `your-stem-claims/${claim.id}/status`;

  return (
    <ClaimCard
      title="Edith Nourse Rogers STEM Scholarship application"
      subtitle={`Received on ${formattedReceiptDate}`}
    >
      <div className="card-status">
        <p>Status: Denied</p>
        <p>Last updated on: {formattedDeniedAtDate}</p>
      </div>
      <ClaimCard.Link
        ariaLabel={ariaLabel}
        href={href}
        onClick={handlers.onClick}
      />
    </ClaimCard>
  );
}

StemClaimListItem.propTypes = {
  claim: PropTypes.object,
};
