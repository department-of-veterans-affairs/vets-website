import React from 'react';
import PropTypes from 'prop-types';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import {
  getClaimPhaseTypeHeaderText,
  buildDateFormatter,
  getStatusDescription,
  generateClaimTitle,
  getShowEightPhases,
} from '../utils/helpers';
import ClaimCard from './ClaimCard';
import { DemoNotation } from '../demo';
import useFailureLabel from '../hooks/useFailureLabel';

const formatDate = buildDateFormatter();

const getLastUpdated = claim => {
  const updatedOn = formatDate(
    claim.attributes.claimPhaseDates?.phaseChangeDate,
  );

  return `Moved to this step on ${updatedOn}`;
};

const showPreDecisionCommunications = claim => {
  const { decisionLetterSent, status } = claim.attributes;

  return !decisionLetterSent && status !== 'COMPLETE';
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
  const showEightPhases = getShowEightPhases(
    claimTypeCode,
    cstClaimPhasesEnabled,
  );

  const showPrecomms = showPreDecisionCommunications(claim);
  const formattedReceiptDate = formatDate(claimDate);
  const humanStatus = showEightPhases
    ? getClaimPhaseTypeHeaderText(claimPhaseDates.phaseType)
    : getStatusDescription(status);
  const showAlert = showPrecomms && documentsNeeded;

  const ariaLabel = `Details for claim submitted on ${formattedReceiptDate}`;
  const href = `/your-claims/${claim.id}/status`;

  const { failureLabel } = useFailureLabel(evidenceSubmissions, claim.id);

  return (
    <ClaimCard
      title={generateClaimTitle(claim)}
      label={failureLabel}
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
      {showAlert && (
        <>
          <DemoNotation
            theme="change"
            title="Update content"
            before={
              '"We requested more information from you: Check the claim details to learn more."'
            }
            after={
              '"We need more information from you." (bold) + "This message will go away when we finish reviewing your response."'
            }
          />
          <va-alert status="info" slim>
            <strong>We need more information from you.</strong> This message
            will go away when we finish reviewing your response.
          </va-alert>
        </>
      )}
      <ClaimCard.Link ariaLabel={ariaLabel} href={href} />
    </ClaimCard>
  );
}

ClaimsListItem.propTypes = {
  claim: PropTypes.object,
};
