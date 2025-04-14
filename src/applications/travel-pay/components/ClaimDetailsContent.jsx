import React from 'react';
import PropTypes from 'prop-types';

import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';

import useSetPageTitle from '../hooks/useSetPageTitle';
import { formatDateTime } from '../util/dates';
import { STATUSES } from '../constants';
import { toPascalCase } from '../util/string-helpers';

const title = 'Your travel reimbursement claim';

export default function ClaimDetailsContent(props) {
  const {
    createdOn,
    claimStatus,
    claimNumber,
    appointmentDate: appointmentDateTime,
    facilityName,
    modifiedOn,
    reimbursementAmount,
    documents,
  } = props;
  useSetPageTitle(title);
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const claimsMgmtToggle = useToggleValue(
    TOGGLE_NAMES.travelPayClaimsManagement,
  );

  const [appointmentDate, appointmentTime] = formatDateTime(
    appointmentDateTime,
    true,
  );
  const [createDate, createTime] = formatDateTime(createdOn);
  const [updateDate, updateTime] = formatDateTime(modifiedOn);

  const getDocLinkList = list =>
    // TODO: Replace href with download mechanism (encoded string, blob, etc)
    list.map(({ href, filename }) => (
      <div
        key={`claim-attachment-dl-${filename}`}
        className="vads-u-margin-top--1"
      >
        <a href={href ?? '#'} download>
          <va-icon
            class="vads-u-margin-right--1 travel-pay-claim-download-link-icon"
            icon="file_download"
          />
          <span className="vads-u-text-decoration--underline">{filename}</span>
        </a>
      </div>
    ));

  const documentCategories = (documents ?? []).reduce(
    (acc, doc) => {
      // Do not show clerk note attachments
      if (!doc.mimetype) return acc;
      // TODO: Solidify on pattern match criteria for decision letter, other statically named docs
      if (doc.filename.includes('DecisionLetter')) acc.clerk.push(doc);
      else acc.user.push(doc);
      return acc;
    },
    { clerk: [], user: [] },
  );

  return (
    <>
      <h1>
        {title} for {appointmentDate}
      </h1>
      <span
        className="vads-u-font-size--h2 vads-u-font-weight--bold"
        data-testid="claim-details-claim-number"
      >
        Claim number: {claimNumber}
      </span>
      <h2 className="vads-u-font-size--h3">Claim status: {claimStatus}</h2>
      {claimsMgmtToggle && (
        <>
          <va-additional-info
            class="vads-u-margin-y--3"
            trigger="What does this status mean?"
          >
            {STATUSES[toPascalCase(claimStatus)] ? (
              <p data-testid="status-definition-text">
                {STATUSES[toPascalCase(claimStatus)].definition}
              </p>
            ) : (
              <p className="vads-u-margin-top--2">
                If you need help understanding your claim, call the BTSSS call
                center at <va-telephone contact="8555747292" /> (
                <va-telephone tty contact="711" />) Monday through Friday, 8:00
                a.m. to 8:00 p.m. ET. Have your claim number ready to share when
                you call.
              </p>
            )}
          </va-additional-info>
          {claimStatus === STATUSES.Denied.name && <AppealContent />}
          {documentCategories.clerk.length > 0 && (
            <a href='#' download>
              <va-icon
                class="vads-u-margin-right--1 travel-pay-claim-download-link-icon"
                icon="file_download"
              />
              <span className="vads-u-text-decoration--underline">
                Download your decision letter
              </span>
            </a>
          )}
        </>
      )}
      <h2 className="vads-u-font-size--h3">Claim information</h2>
      <p className="vads-u-font-weight--bold vads-u-margin-bottom--0">Where</p>
      <p className="vads-u-margin-y--0">
        {appointmentDate} at {appointmentTime} appointment
      </p>
      <p className="vads-u-margin-top--0">{facilityName}</p>
      {claimsMgmtToggle &&
        reimbursementAmount > 0 && (
          <p className="vads-u-font-weight--bold">
            Reimbursement amount of ${reimbursementAmount}
          </p>
        )}
      <p className="vads-u-margin-y--0">
        Submitted on {createDate} at {createTime}
      </p>
      <p className="vads-u-margin-y--0">
        Updated on on {updateDate} at {updateTime}
      </p>
      {claimsMgmtToggle &&
        documentCategories.user.length > 0 && (
          <>
            <p className="vads-u-font-weight--bold vads-u-margin-bottom--0">
              Documents you submitted
            </p>
            {getDocLinkList(documentCategories.user)}
          </>
        )}
    </>
  );
}

ClaimDetailsContent.propTypes = {
  appointmentDate: PropTypes.string.isRequired,
  claimNumber: PropTypes.string.isRequired,
  claimStatus: PropTypes.string.isRequired,
  createdOn: PropTypes.string.isRequired,
  facilityName: PropTypes.string.isRequired,
  modifiedOn: PropTypes.string.isRequired,
  documents: PropTypes.array,
  reimbursementAmount: PropTypes.number,
};

function AppealContent() {
  return (
    <>
      <va-link
        external
        text="Appeal the claim decision"
        href="/decision-reviews"
      />
      <va-additional-info
        class="vads-u-margin-y--3"
        trigger="What to expect when you appeal"
      >
        When appealing this decision you can:
        <ul>
          <li>Submit an appeal via the Board of Appeals.</li>
          <li>
            Send a secure message to the Beneficiary Travel team of the VA
            facility that provided your care or of you home VA facility.
          </li>
          <li>
            Mail a printed version of Form 10-0998 with the appropriate
            documentation.
          </li>
        </ul>
      </va-additional-info>
    </>
  );
}
