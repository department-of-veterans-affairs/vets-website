import React from 'react';
import PropTypes from 'prop-types';

import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';

import useSetPageTitle from '../hooks/useSetPageTitle';
import { formatDateTime } from '../util/dates';
import { STATUSES } from '../constants';

const title = 'Your travel reimbursement claim';

export default function ClaimDetailsContent({
  createdOn,
  claimStatus,
  claimNumber,
  appointmentDateTime,
  facilityName,
  modifiedOn,
  reimbursementAmount,
  documents,
}) {
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
      {claimsMgmtToggle &&
        documents?.length > 0 && <DocumentSection documents={documents} />}
      {claimsMgmtToggle &&
        claimStatus === STATUSES.Denied.name && <AppealContent />}
      <h2 className="vads-u-font-size--h3">Claim information</h2>
      <p className="vads-u-font-weight--bold vads-u-margin-bottom--0">Where</p>
      <p className="vads-u-margin-y--0">
        {appointmentDate} at {appointmentTime} appointment
      </p>
      <p className="vads-u-margin-top--0">{facilityName}</p>
      {claimsMgmtToggle &&
        reimbursementAmount > 0 && (
          <p className="vads-u-margin-bottom--0">
            Reimbursement amount of ${reimbursementAmount}
          </p>
        )}
      <p className="vads-u-margin-y--0">
        Submitted on {createDate} at {createTime}
      </p>
      <p className="vads-u-margin-y--0">
        Updated on on {updateDate} at {updateTime}
      </p>
    </>
  );
}

ClaimDetailsContent.propTypes = {
  appointmentDateTime: PropTypes.string.isRequired,
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

function DocumentSection({ documents }) {
  const documentCategories = documents.reduce(
    (acc, doc) => {
      if (!doc.mimetype) return acc;
      // TODO: Solidify on pattern match criteria for decision letter, other statically named docs
      if (doc.filename.includes('DecisionLetter')) acc.clerk.push(doc);
      else acc.other.push(doc);
      return acc;
    },
    { clerk: [], other: [] },
  );

  const getDocLinkList = list =>
    // TODO: Replace href with download mechanism (encoded string, blob, etc)
    list.map(({ href, filename }) => (
      <div
        key={`claim-attachment-dl-${filename}`}
        className="vads-u-margin-top--2"
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

  return (
    <>
      <h2 className="vads-u-font-size--h3">Documents</h2>
      <h3 className="vads-u-font-size--h4 vads-u-margin-top--2">
        Documents the clerk submitted
      </h3>
      {getDocLinkList(documentCategories.clerk)}
      <div className="vads-u-margin-top--2">
        <va-link
          href="#"
          text="Download VA Form 10-0998 (PDF) to seek further review of our healthcare benefits decision"
        />
      </div>
      <h3 className="vads-u-font-size--h4 vads-u-margin-top--2">
        Documents you submitted
      </h3>
      {getDocLinkList(documentCategories.other)}
    </>
  );
}

DocumentSection.propTypes = {
  documents: PropTypes.array,
};
