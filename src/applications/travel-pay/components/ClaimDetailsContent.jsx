import React from 'react';
import PropTypes from 'prop-types';

import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';

import useSetPageTitle from '../hooks/useSetPageTitle';
import { formatDateTime } from '../util/dates';
import { STATUSES, FORM_100998_LINK } from '../constants';
import { toPascalCase, currency } from '../util/string-helpers';
import DocumentDownload from './DocumentDownload';
import DecisionReason from './DecisionReason';

const title = 'Your travel reimbursement claim';

export default function ClaimDetailsContent({
  createdOn,
  claimStatus,
  claimNumber,
  claimId,
  appointmentDate: appointmentDateTime,
  facilityName,
  modifiedOn,
  totalCostRequested,
  reimbursementAmount,
  documents,
  decisionLetterReason,
}) {
  useSetPageTitle('Travel Reimbursement Claim Details');
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const claimsMgmtToggle = useToggleValue(
    TOGGLE_NAMES.travelPayClaimsManagement,
  );
  const claimsMgmtDecisionReasonToggle = useToggleValue(
    TOGGLE_NAMES.travelPayClaimsManagementDecisionReason,
  );

  const [appointmentDate, appointmentTime] = formatDateTime(
    appointmentDateTime,
    true,
  );
  const [createDate, createTime] = formatDateTime(createdOn);
  const [updateDate, updateTime] = formatDateTime(modifiedOn);

  const showDecisionReason =
    decisionLetterReason && claimsMgmtDecisionReasonToggle;

  const getDocLinkList = list =>
    list.map(({ filename, text, documentId }) => (
      <div
        key={`claim-attachment-dl-${filename}`}
        className="vads-u-margin-top--1"
        data-testid="user-submitted-documents"
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
            <p
              className="vads-u-margin-top--2"
              data-testid="status-definition-text"
            >
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
          {showDecisionReason && (
            <DecisionReason
              claimStatus={claimStatus}
              decisionLetterReason={decisionLetterReason}
            />
          )}
          {documentCategories.clerk.length > 0 &&
            getDocLinkList(documentCategories.clerk)}
        </>
      )}
      <h2 className="vads-u-font-size--h3">Claim information</h2>
      {claimsMgmtToggle && (
        <>
          {totalCostRequested > 0 && (
            <div className="vads-u-margin-y--2">
              <p className="vads-u-font-weight--bold vads-u-margin-bottom--0">
                Amount
              </p>
              <p className="vads-u-margin--0">
                Submitted amount of {currency(totalCostRequested)}
              </p>
              {reimbursementAmount > 0 && (
                <p className="vads-u-margin--0">
                  Reimbursement amount of {currency(reimbursementAmount)}
                </p>
              )}
            </div>
          )}
          {reimbursementAmount > 0 &&
            totalCostRequested !== reimbursementAmount && (
              <va-additional-info
                class="vads-u-margin-y--2"
                trigger="Why are my amounts different"
              >
                <p>
                  The VA travel pay deductible is $3 for a one-way trip and $6
                  for a round trip, with a maximum of $18 per month. After a
                  Veteran reaches the $18 monthly deductible, the VA will pay
                  the full cost of their approved travel for the rest of that
                  month.{' '}
                  <va-link
                    href="/resources/reimbursed-va-travel-expenses-and-mileage-rate#monthlydeductible"
                    text="Learn more about travel expenses monthly deductible"
                  />
                </p>
                <p>
                  If the difference is greater than the deductible, then the
                  Beneficiary Travel team may have issued a partial payment. You
                  can review the decision letter for more information.
                </p>
              </va-additional-info>
            )}
        </>
      )}
      <p className="vads-u-font-weight--bold vads-u-margin-bottom--0">
        Claim submission timeline
      </p>
      <p className="vads-u-margin-y--0">
        Submitted on {createDate} at {createTime}
      </p>
      <p className="vads-u-margin-y--0">
        Updated on {updateDate} at {updateTime}
      </p>
      <p className="vads-u-font-weight--bold vads-u-margin-bottom--0">
        Appointment information
      </p>
      <p className="vads-u-margin-y--0">
        {appointmentDate} at {appointmentTime} appointment
      </p>
      <p className="vads-u-margin-top--0">{facilityName}</p>
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
              <p className="vads-u-margin-bottom--0">
                You can appeal a claim decision online or by mail. For both
                options, you’ll need to fill out a copy of Your Rights to Seek
                Further Review of Our Healthcare Benefits Decision (VA Form
                10-0998). You’ll also need to include any required supporting
                documents with your appeal.
              </p>
              {documentCategories.forms.length > 0 ? (
                <DocumentDownload
                  text="Get VA Form 10-0998 to download"
                  claimId={claimId}
                  documentId={documentCategories.forms[0].documentId}
                  filename={documentCategories.forms[0].filename}
                />
              ) : (
                <va-link
                  text="Get VA Form 10-0998 to download"
                  href={FORM_100998_LINK}
                />
              )}{' '}
              <p className="vads-u-font-weight--bold vads-u-margin-bottom--0">
                Option 1: Online
              </p>
              <p className="vads-u-margin-bottom--0 vads-u-margin-top--0">
                Send a secure message to the Beneficiary Travel team at the VA
                facility that provided your care or at your home VA facility.
                Attach a copy of VA Form 10-0998 and any supporting documents.
              </p>
              <va-link
                text="Send a secure message"
                href="/health-care/send-receive-messages/"
              />
              <p className="vads-u-font-weight--bold vads-u-margin-bottom--0">
                Option 2: By mail
              </p>
              <p className="vads-u-margin-top--0">
                Mail a printed copy of VA Form 10-0998 and any supporting
                documents to the address listed in your decision letter.
              </p>
              <p>
                <span className="vads-u-font-weight--bold">Note:</span> If you’d
                like to submit an appeal via the Board of Veterans’ Appeals,
                follow the instructions in your decision letter.
              </p>
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
  decisionLetterReason: PropTypes.string,
  documents: PropTypes.array,
  reimbursementAmount: PropTypes.number,
  totalCostRequested: PropTypes.number,
};
