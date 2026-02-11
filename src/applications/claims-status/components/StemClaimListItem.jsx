import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { buildDateFormatter } from '../utils/helpers';
import ClaimCard from './ClaimCard';
import useFailureLabel from '../hooks/useFailureLabel';

const formatDate = buildDateFormatter();

export default function StemClaimListItem({ claim }) {
  const { automatedDenial, deniedAt, submittedAt, evidenceSubmissions = [] } =
    claim.attributes || {};

  const { failureLabel } = useFailureLabel(evidenceSubmissions, claim.id);

  if (!automatedDenial) {
    return null;
  }

  const formattedDeniedAtDate = formatDate(deniedAt);
  const formattedReceiptDate = formatDate(submittedAt);

  const handlers = {
    onClick: () => {
      recordEvent({
        event: 'cta-action-link-click',
        'action-link-type': 'secondary',
        'action-link-click-label': 'Details',
        'action-link-icon-color': 'blue',
        'claim-type': 'STEM Scholarship',
        'claim-last-updated-date': formattedDeniedAtDate,
        'claim-submitted-date': formattedReceiptDate,
        'claim-status': 'Denied',
      });
    },
  };

  const ariaLabel = `Details for claim submitted on ${formattedReceiptDate}`;
  const href = `/your-stem-claims/${claim.id}/status`;

  return (
    <ClaimCard
      title="Edith Nourse Rogers STEM Scholarship application"
      label={failureLabel}
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
