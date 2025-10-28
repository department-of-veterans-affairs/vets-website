import React from 'react';
import PropTypes from 'prop-types';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { Toggler } from '~/platform/utilities/feature-toggles';
import {
  buildDateFormatter,
  getFailedSubmissionsWithinLast30Days,
} from '../utils/helpers';
import ClaimCard from './ClaimCard';
import UploadType2ErrorAlertSlim from './UploadType2ErrorAlertSlim';

const formatDate = buildDateFormatter();

export default function StemClaimListItem({ claim }) {
  const {
    automatedDenial,
    deniedAt,
    submittedAt,
    evidenceSubmissions = [],
  } = claim.attributes || {};

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

  const failedSubmissionsWithinLast30Days = getFailedSubmissionsWithinLast30Days(
    evidenceSubmissions,
  );

  return (
    <ClaimCard
      title="Edith Nourse Rogers STEM Scholarship application"
      subtitle={`Received on ${formattedReceiptDate}`}
    >
      <div className="card-status">
        <p>Status: Denied</p>
        <p>Last updated on: {formattedDeniedAtDate}</p>
      </div>
      <Toggler toggleName={Toggler.TOGGLE_NAMES.cstShowDocumentUploadStatus}>
        <Toggler.Enabled>
          <UploadType2ErrorAlertSlim
            failedSubmissions={failedSubmissionsWithinLast30Days}
          />
        </Toggler.Enabled>
      </Toggler>
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
