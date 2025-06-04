import React from 'react';
import PropTypes from 'prop-types';

import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';

import useSetPageTitle from '../hooks/useSetPageTitle';
import { formatDateTime } from '../util/dates';
import { STATUSES, FORM_100998_LINK } from '../constants';
import { toPascalCase } from '../util/string-helpers';
import DocumentDownload from './DocumentDownload';

const title = 'Your travel reimbursement claim';

export default function ClaimDetailsContent({
  createdOn,
  claimStatus,
  claimNumber,
  claimId,
  appointmentDate: appointmentDateTime,
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

  const getDocLinkList = list =>
    list.map(({ filename, text, documentId }) => (
      <div
        key={`claim-attachment-dl-${filename}`}
        className="vads-u-margin-top--1"
      >
        <DocumentDownload
          text={text}
          claimId={claimId}
          documentId={documentId}
          filename={filename}
        />
      </div>
    ));

  const documentCategories = (documents ?? []).reduce(
    (acc, doc) => {
      // Do not show clerk note attachments
      if (!doc.mimetype) return acc;
      // TODO: Solidify on pattern match criteria for decision letter, other statically named docs
      if (
        doc.filename.includes('Rejection Letter') ||
        doc.filename.includes('Decision Letter')
      )
        acc.clerk.push({ ...doc, text: 'Download your decision letter' });
      else if (
        doc.filename ===
        'VA Form 10-0998 Your Rights to Appeal Our Decision.pdf'
      ) {
        acc.forms.push(doc);
      } else {
        acc.user.push({ ...doc, text: doc.filename });
      }
      return acc;
    },
    { clerk: [], user: [], forms: [] },
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
          {STATUSES[toPascalCase(claimStatus)] ? (
            <>
              <p className="vads-u-font-weight--bold vads-u-margin-top--2 vads-u-margin-bottom--0">
                What does this status mean
              </p>
              <p
                className="vads-u-margin-top--0"
                data-testid="status-definition-text"
              >
                {STATUSES[toPascalCase(claimStatus)].definition}
              </p>
            </>
          ) : (
            <p className="vads-u-margin-top--2">
              If you need help understanding your claim, call the BTSSS call
              center at <va-telephone contact="8555747292" /> (
              <va-telephone tty contact="711" />) Monday through Friday, 8:00
              a.m. to 8:00 p.m. ET. Have your claim number ready to share when
              you call.
            </p>
          )}
          {documentCategories.clerk.length > 0 &&
            getDocLinkList(documentCategories.clerk)}
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
          <p>Reimbursement amount of ${reimbursementAmount}</p>
        )}
      <p className="vads-u-margin-y--0">
        Submitted on {createDate} at {createTime}
      </p>
      <p className="vads-u-margin-y--0">
        Updated on on {updateDate} at {updateTime}
      </p>
      {claimsMgmtToggle && (
        <>
          {documentCategories.user.length > 0 && (
            <>
              <p className="vads-u-font-weight--bold vads-u-margin-bottom--0">
                Documents you submitted
              </p>
              {getDocLinkList(documentCategories.user)}
            </>
          )}
          {claimStatus === STATUSES.Denied.name && (
            <>
              <h2 className="vads-u-font-size--h3">
                Appealing a claim decision
              </h2>
              <p>If you would like to appeal this decision you can:</p>
              <ul>
                <li>Submit an appeal via the Board of Appeals.</li>
                <li>
                  Send a secure message to the Beneficiary Travel team of the VA
                  facility that provided your care or of you home VA facility.
                </li>
                <li>
                  Mail a printed version of{' '}
                  {documentCategories.forms.length > 0 ? (
                    <DocumentDownload
                      text="VA Form 10-0998 (PDF)"
                      claimId={claimId}
                      documentId={documentCategories.forms[0].documentId}
                      filename={documentCategories.forms[0].filename}
                    />
                  ) : (
                    <va-link
                      text="VA Form 10-0998 (PDF)"
                      href={FORM_100998_LINK}
                    />
                  )}{' '}
                  with the appropriate documentation.
                </li>
              </ul>
              <va-link-action
                text="Appeal the claim decision"
                href="/decision-reviews"
              />
            </>
          )}
        </>
      )}
    </>
  );
}

ClaimDetailsContent.propTypes = {
  appointmentDate: PropTypes.string.isRequired,
  claimId: PropTypes.string.isRequired,
  claimNumber: PropTypes.string.isRequired,
  claimStatus: PropTypes.string.isRequired,
  createdOn: PropTypes.string.isRequired,
  facilityName: PropTypes.string.isRequired,
  modifiedOn: PropTypes.string.isRequired,
  documents: PropTypes.array,
  reimbursementAmount: PropTypes.number,
};
