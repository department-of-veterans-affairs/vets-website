import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import {
  getClaimStatusDescription,
  isClaimComplete,
  getClaimType,
} from '../../utils/claims-helpers';
import { replaceDashesWithSlashes as replace } from '../../utils/date-formatting/helpers';

const capitalizeFirstLetter = input => {
  const capitalizedFirstLetter = input[0].toUpperCase();
  return `${capitalizedFirstLetter}${input.slice(1)}`;
};

function handleViewClaim() {
  recordEvent({
    event: 'dashboard-navigation',
    'dashboard-action': 'view-button',
    'dashboard-product': 'view-claim',
  });
}

const claimInfo = claim => {
  return {
    inProgress: !isClaimComplete(claim),
    claimDate: claim.attributes.claimDate,
    status: getClaimStatusDescription(claim.attributes.status),
  };
};

const CHAMPVA_FORM_TITLE_MAP = {
  '10-10d': 'Application for CHAMPVA benefits',
  '10-10d-extended': 'Application for CHAMPVA benefits',
  '10-7959a': 'CHAMPVA claim',
  '10-7959c': 'CHAMPVA other health insurance certification',
  '10-7959f-1': 'Foreign Medical Program registration',
  '10-7959f-2': 'Foreign Medical Program claim',
};

const CHAMPVA_FORM_DISPLAY_MAP = {
  '10-10d': '10-10d',
  '10-10d-extended': '10-10d',
  '10-7959a': '10-7959a',
  '10-7959c': '10-7959c',
  '10-7959f-1': '10-7959f-1',
  '10-7959f-2': '10-7959f-2',
};

const CLAIM_STATUS_LABEL_MAP = {
  CLAIM_RECEIVED: 'RECEIVED',
  INITIAL_REVIEW: 'SUBMISSION IN PROGRESS',
  EVIDENCE_GATHERING_REVIEW_DECISION: 'SUBMISSION IN PROGRESS',
  PREPARATION_FOR_NOTIFICATION: 'SUBMISSION IN PROGRESS',
  COMPLETE: 'RECEIVED',
};

const RECEIVED_STATUSES = new Set([
  'processed',
  'manually processed',
  'vbms',
  'complete',
]);

const ACTION_NEEDED_STATUSES = new Set([
  'error',
  'failed',
  'rejected',
  'submission failed',
  'action needed',
  'expired',
]);

const getChampvaStatusLabel = rawStatus => {
  const status = rawStatus?.toString()?.trim();
  if (!status) return 'SUBMISSION IN PROGRESS';

  if (CLAIM_STATUS_LABEL_MAP[status]) return CLAIM_STATUS_LABEL_MAP[status];

  const normalized = status.toLowerCase();
  if (RECEIVED_STATUSES.has(normalized)) return 'RECEIVED';
  if (ACTION_NEEDED_STATUSES.has(normalized)) return 'ACTION NEEDED';

  return 'SUBMISSION IN PROGRESS';
};

const extractFormId = claim => {
  const searchSpace = [
    claim?.attributes?.displayTitle,
    claim?.attributes?.claimType,
    claim?.attributes?.claimTypeBase,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const match = searchSpace.match(
    /10-10d-extended|10-7959f-1|10-7959f-2|10-7959a|10-7959c|10-10d/,
  );
  return match?.[0];
};

const isChampvaClaim = claim => {
  const searchSpace = [
    claim?.attributes?.displayTitle,
    claim?.attributes?.claimType,
    claim?.attributes?.claimTypeBase,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return searchSpace.includes('champva') || !!extractFormId(claim);
};

const Claim = ({ claim }) => {
  if (!claim.attributes) {
    throw new TypeError(
      '`claim` prop is malformed; it should have an `attributes` property.',
    );
  }
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const champvaProviderEnabled = useToggleValue(
    TOGGLE_NAMES.benefitsClaimsIvcChampvaProvider,
  );
  const { inProgress, claimDate, status } = claimInfo(claim);
  const dateRecd = format(new Date(replace(claimDate)), 'MMMM d, yyyy');
  const champvaClaim = isChampvaClaim(claim);
  const showChampvaCard = champvaProviderEnabled && champvaClaim;
  const champvaFormId = extractFormId(claim);
  const champvaTitle = CHAMPVA_FORM_TITLE_MAP[champvaFormId];
  const champvaDisplayFormId = CHAMPVA_FORM_DISPLAY_MAP[champvaFormId];
  const champvaStatusLabel = getChampvaStatusLabel(claim.attributes.status);
  const receivedDate = format(
    new Date(replace(claim.attributes.closeDate || claimDate)),
    'MMMM d, yyyy',
  );
  const showReceivedDate = champvaStatusLabel === 'RECEIVED';

  const content = showChampvaCard ? (
    <>
      <span className="usa-label">{champvaStatusLabel}</span>
      <h3 className="vads-u-margin-top--1 vads-u-margin-bottom--0 dd-privacy-mask">
        {champvaTitle || capitalizeFirstLetter(getClaimType(claim))}
      </h3>
      {champvaDisplayFormId && (
        <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0">
          VA Form {champvaDisplayFormId}
        </p>
      )}
      <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
        Submitted on: {dateRecd}
        {showReceivedDate && (
          <>
            <br />
            Received on: {receivedDate}
          </>
        )}
      </p>
      <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
        Next step: We’ll review your form. If we need more information, we’ll
        contact you.
      </p>
      <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
        If you have questions, call us at <va-telephone contact="8008271000" />{' '}
        (<va-telephone contact="711" tty />
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </>
  ) : (
    <>
      <h3 className="vads-u-margin-top--0 dd-privacy-mask">
        {capitalizeFirstLetter(getClaimType(claim))} claim received:
        <br />
        {dateRecd}
      </h3>
      <div className="vads-u-display--flex">
        <va-icon
          icon="check_circle"
          size={2}
          srtext="Success"
          class="vads-u-margin-right--1 vads-u-margin-top--0p5 vads-u-color--green"
        />
        <div>
          <p className="vads-u-margin-y--0">Status: {status}</p>
          {inProgress && claim.attributes.developmentLetterSent ? (
            <p className="vads-u-margin-y--0">
              We sent you a development letter
            </p>
          ) : null}
          {claim.attributes.decisionLetterSent ? (
            <p className="vads-u-margin-y--0">We sent you a decision letter</p>
          ) : null}
          {inProgress && claim.attributes.documentsNeeded ? (
            <p className="vads-u-margin-y--0">Items need attention</p>
          ) : null}
        </div>
      </div>
      <div className="vads-u-margin-top--0p5 vads-u-padding-y--1">
        <va-link
          active
          text="Review details"
          label={`Review claim received ${dateRecd}`}
          href={`/track-claims/your-claims/${claim.id}/status`}
          onClick={handleViewClaim}
        />
      </div>
    </>
  );

  return (
    <div className="vads-u-margin-bottom--2">
      <va-card>{content}</va-card>
    </div>
  );
};

Claim.propTypes = {
  claim: PropTypes.object.isRequired,
};

export default Claim;
