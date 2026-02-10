import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Toggler,
  useFeatureToggle,
} from '~/platform/utilities/feature-toggles';
import {
  getClaimPhaseTypeHeaderText,
  buildDateFormatter,
  getStatusDescription,
  generateClaimTitle,
  getShowEightPhases,
  getFailedSubmissionsWithinLast30Days,
} from '../utils/helpers';
import ClaimCard from './ClaimCard';
import UploadType2ErrorAlertSlim from './UploadType2ErrorAlertSlim';

const formatDate = buildDateFormatter();

const getLastUpdated = claim => {
  const { claimPhaseDates, closeDate, claimDate } = claim.attributes || {};
  const phaseChangeDate = claimPhaseDates?.phaseChangeDate;
  const hasPhaseDate = !!phaseChangeDate;
  const updatedOn = formatDate(phaseChangeDate || closeDate || claimDate);

  return hasPhaseDate
    ? `Moved to this step on ${updatedOn}`
    : `Last updated on ${updatedOn}`;
};

const showPreDecisionCommunications = claim => {
  const { decisionLetterSent, status } = claim.attributes;

  return !decisionLetterSent && status !== 'COMPLETE';
};

const isClaimComplete = claim => claim.attributes.status === 'COMPLETE';

const IVC_CHAMPVA_FORM_IDS = [
  '10-10d',
  '10-10d-extended',
  '10-7959a',
  '10-7959c',
  '10-7959f-1',
  '10-7959f-2',
];

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

const extractFormId = claim => {
  const { claimType, claimTypeBase, displayTitle } = claim.attributes || {};
  const searchSpace = [claimType, claimTypeBase, displayTitle]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  const match = searchSpace.match(
    /10-10d-extended|10-7959f-1|10-7959f-2|10-7959a|10-7959c|10-10d/,
  );
  return match?.[0];
};

const isChampvaClaim = claim => {
  const { claimType, claimTypeBase, displayTitle } = claim.attributes || {};
  const normalizedValues = [claimType, claimTypeBase, displayTitle]
    .filter(Boolean)
    .map(value => value.toLowerCase());

  return normalizedValues.some(
    value =>
      value.includes('champva') ||
      IVC_CHAMPVA_FORM_IDS.some(formId => value.includes(formId)),
  );
};

const CommunicationsItem = ({ children, icon }) => {
  return (
    <li className="vads-u-margin--0">
      <va-icon
        icon={icon}
        size={3}
        class="vads-u-margin-right--1"
        aria-hidden="true"
      />
      {children}
    </li>
  );
};

CommunicationsItem.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.string.isRequired,
};

export default function ClaimsListItem({ claim }) {
  const {
    claimDate,
    claimPhaseDates,
    claimTypeCode,
    decisionLetterSent,
    developmentLetterSent,
    documentsNeeded,
    status,
    evidenceSubmissions = [],
  } = claim.attributes || {};

  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const cstClaimPhasesEnabled = useToggleValue(TOGGLE_NAMES.cstClaimPhases);
  const champvaProviderEnabled = useToggleValue(
    TOGGLE_NAMES.benefitsClaimsIvcChampvaProvider,
  );
  const showEightPhases = getShowEightPhases(
    claimTypeCode,
    cstClaimPhasesEnabled,
  );

  const inProgress = !isClaimComplete(claim);
  const champvaFormId = extractFormId(claim);
  const showChampvaPatternCard =
    champvaProviderEnabled && isChampvaClaim(claim);
  const showSubmittedLabel = showChampvaPatternCard && inProgress;
  const showPrecomms = showPreDecisionCommunications(claim);
  const formattedReceiptDate = formatDate(claimDate);
  const phaseType = claimPhaseDates?.phaseType;
  const phaseHeaderText =
    showEightPhases && phaseType
      ? getClaimPhaseTypeHeaderText(phaseType)
      : getStatusDescription(status);
  const humanStatus = phaseHeaderText || status;
  const showAlert = showPrecomms && documentsNeeded;
  const cardLabel = useMemo(
    () => {
      if (showSubmittedLabel) return 'In Progress';
      if (inProgress) return 'In Progress';
      return null;
    },
    [inProgress, showSubmittedLabel],
  );

  const ariaLabel = `Details for claim submitted on ${formattedReceiptDate}`;
  const href = `/your-claims/${claim.id}/status`;

  // Memoize failed submissions to prevent UploadType2ErrorAlertSlim from receiving
  // a new array reference on every render, which would break its useEffect tracking
  const failedSubmissionsWithinLast30Days = useMemo(
    () => getFailedSubmissionsWithinLast30Days(evidenceSubmissions),
    [evidenceSubmissions],
  );

  if (showChampvaPatternCard) {
    const champvaTitle = CHAMPVA_FORM_TITLE_MAP[champvaFormId];
    const displayFormId = CHAMPVA_FORM_DISPLAY_MAP[champvaFormId];
    const submittedOn = formatDate(claimDate);
    const receivedOn = formatDate(claim.attributes.closeDate || claimDate);

    return (
      <ClaimCard
        title={champvaTitle || 'Application for CHAMPVA benefits'}
        label={cardLabel}
      >
        {displayFormId && (
          <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0">
            VA Form {displayFormId}
          </p>
        )}
        <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
          Submitted on: {submittedOn}
          <br />
          Received on: {receivedOn}
        </p>
        <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
          Next step: We’ll review your form. If we need more information, we’ll
          contact you.
        </p>
        <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
          If you have questions, call us at{' '}
          <va-telephone contact="8008271000" /> (
          <va-telephone contact="711" tty />
          ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
        </p>
      </ClaimCard>
    );
  }

  return (
    <ClaimCard
      title={generateClaimTitle(claim)}
      label={cardLabel}
      subtitle={`Received on ${formattedReceiptDate}`}
    >
      <ul className="communications">
        {showPrecomms && developmentLetterSent ? (
          <CommunicationsItem icon="mail">
            We sent you a development letter
          </CommunicationsItem>
        ) : null}
        {decisionLetterSent && (
          <CommunicationsItem icon="mail">
            You have a decision letter ready
          </CommunicationsItem>
        )}
      </ul>
      <div className="card-status">
        {humanStatus && <p>{humanStatus}</p>}
        <p>{getLastUpdated(claim)}</p>
      </div>
      <Toggler toggleName={Toggler.TOGGLE_NAMES.cstShowDocumentUploadStatus}>
        <Toggler.Enabled>
          <UploadType2ErrorAlertSlim
            claimId={claim.id}
            failedSubmissions={failedSubmissionsWithinLast30Days}
          />
        </Toggler.Enabled>
      </Toggler>
      {showAlert && (
        <va-alert status="info" slim>
          <span className="vads-u-font-weight--bold">
            We requested more information from you:
          </span>{' '}
          Check the claim details to learn more.
          <div className="vads-u-margin-top--2">
            This message will go away when we finish reviewing your response.
          </div>
        </va-alert>
      )}
      <ClaimCard.Link ariaLabel={ariaLabel} href={href} />
    </ClaimCard>
  );
}

ClaimsListItem.propTypes = {
  claim: PropTypes.object,
};
