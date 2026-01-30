import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import { TRAVEL_PAY_FILE_NEW_CLAIM_ENTRY } from '@department-of-veterans-affairs/mhv/exports';

import { selectAppointment } from '../redux/selectors';
import useSetPageTitle from '../hooks/useSetPageTitle';
import { formatDateTime, stripTZOffset } from '../util/dates';
import { STATUSES, FORM_100998_LINK, BTSSS_PORTAL_URL } from '../constants';
import { toPascalCase, currency } from '../util/string-helpers';
import {
  hasUnassociatedDocuments,
  isClaimIncompleteOrSaved,
} from '../util/complex-claims-helper';
import DocumentDownload from './DocumentDownload';
import DecisionReason from './DecisionReason';
import OutOfBoundsAppointmentAlert from './alerts/OutOfBoundsAppointmentAlert';

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
  isOutOfBounds,
  claimSource,
}) {
  useSetPageTitle('Travel Reimbursement Claim Details');
  const appointment = useSelector(selectAppointment);

  // Only use appointment ID if it matches this claim's datetime
  // This prevents using stale appointment data from a previous claim
  const appointmentMatchesClaim =
    appointment?.data?.localStartTime &&
    stripTZOffset(appointment.data.localStartTime) ===
      stripTZOffset(appointmentDateTime);
  const appointmentId = appointmentMatchesClaim ? appointment?.data?.id : null;

  // eslint-disable-next-line no-console
  console.log('=== ClaimDetailsContent Debug ===');
  // eslint-disable-next-line no-console
  console.log('Claim ID:', claimId);
  // eslint-disable-next-line no-console
  console.log('Claim datetime:', appointmentDateTime);
  // eslint-disable-next-line no-console
  console.log('Claim datetime (stripped):', stripTZOffset(appointmentDateTime));
  // eslint-disable-next-line no-console
  console.log('Redux appointment:', appointment?.data);
  // eslint-disable-next-line no-console
  console.log(
    'Redux datetime (stripped):',
    appointment?.data?.localStartTime
      ? stripTZOffset(appointment.data.localStartTime)
      : 'N/A',
  );
  // eslint-disable-next-line no-console
  console.log('Datetimes match?', appointmentMatchesClaim);
  // eslint-disable-next-line no-console
  console.log('Final appointmentId:', appointmentId);
  // eslint-disable-next-line no-console
  console.log('=================================');
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const claimsMgmtToggle = useToggleValue(
    TOGGLE_NAMES.travelPayClaimsManagement,
  );
  const claimsMgmtDecisionReasonToggle = useToggleValue(
    TOGGLE_NAMES.travelPayClaimsManagementDecisionReason,
  );
  const complexClaimsToggle = useToggleValue(
    TOGGLE_NAMES.travelPayEnableComplexClaims,
  );

  const [appointmentDate, appointmentTime] = formatDateTime(
    appointmentDateTime,
    true,
  );
  const [createDate, createTime] = formatDateTime(createdOn);
  const [updateDate, updateTime] = formatDateTime(modifiedOn);

  const showDecisionReason =
    decisionLetterReason && claimsMgmtDecisionReasonToggle;

  // Claim requires BTSSS if:
  // 1) Started in BTSSS OR
  // 2) Has unassociated docs OR
  // 3) Has a problem getting the appointment ID from getAppointmentDataByDateTime
  const requiresBTSSS =
    claimSource !== 'VaGov' ||
    hasUnassociatedDocuments(documents) ||
    !appointmentId;

  // Condition for showing any claim action link (BTSSS or VA.gov)
  const shouldShowClaimAction =
    complexClaimsToggle && isClaimIncompleteOrSaved(claimStatus);

  // Show BTSSS note & redirect link if the saved/incomplete claim requires BTSSS
  const shouldShowBTSSSContent = shouldShowClaimAction && requiresBTSSS;

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
      // Do not show clerk note attachments, which should be missing the mimetype
      if (!doc.mimetype) return acc;

      if (
        doc.filename.includes('Rejection Letter') ||
        doc.filename.includes('Partial Payment Letter') ||
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
      {complexClaimsToggle &&
        isOutOfBounds && (
          <div className="vads-u-margin-y--4">
            <OutOfBoundsAppointmentAlert />
          </div>
        )}
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
              <p
                className="vads-u-margin-top--2"
                data-testid="status-definition-text"
              >
                {complexClaimsToggle
                  ? STATUSES[toPascalCase(claimStatus)].alternativeDefinition ||
                    STATUSES[toPascalCase(claimStatus)].definition
                  : STATUSES[toPascalCase(claimStatus)].definition}
              </p>
              {shouldShowBTSSSContent && (
                <p className="vads-u-margin-top--2">
                  <span className="vads-u-font-weight--bold">Note:</span> We
                  can't file your travel reimbursement claim here right now. But
                  you can still file your claim in the Beneficiary Travel Self
                  Service System (BTSSS).
                </p>
              )}
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
      {shouldShowBTSSSContent && (
        <va-link
          text="Complete and file your claim in BTSSS"
          label="Complete and file your claim in the Beneficiary Travel Self Service System"
          href={BTSSS_PORTAL_URL}
          external
        />
      )}
      {shouldShowClaimAction &&
        !requiresBTSSS && (
          <va-link-action
            text="Complete and file your claim"
            // Specifically NOT a client-side route to ensure
            // redirect logic is evaluated upon entry into complex claims using ComplexClaimRedirect.jsx
            href={`/my-health/travel-pay/file-new-claim/${appointmentId}`}
            onClick={() => {
              sessionStorage.setItem(
                TRAVEL_PAY_FILE_NEW_CLAIM_ENTRY.SESSION_KEY,
                TRAVEL_PAY_FILE_NEW_CLAIM_ENTRY.ENTRY_TYPES.CLAIM,
              );
            }}
          />
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
        Claim timeline
      </p>
      <p className="vads-u-margin-y--0">
        {complexClaimsToggle ? 'Created' : 'Submitted'} on {createDate} at{' '}
        {createTime}
      </p>
      <p className="vads-u-margin-y--0">
        Updated on {updateDate} at {updateTime}
      </p>
      <p className="vads-u-font-weight--bold vads-u-margin-bottom--0">
        Appointment information
      </p>
      <p className="vads-u-margin-y--0">
        {appointmentDate} at {appointmentTime}
      </p>
      <p className="vads-u-margin-top--0">{facilityName}</p>
      {claimsMgmtToggle && (
        <>
          {documentCategories.user.length > 0 && (
            <>
              <p className="vads-u-font-weight--bold vads-u-margin-bottom--0">
                Documents added to this claim
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
  claimSource: PropTypes.string,
  decisionLetterReason: PropTypes.string,
  documents: PropTypes.array,
  isOutOfBounds: PropTypes.bool,
  reimbursementAmount: PropTypes.number,
  totalCostRequested: PropTypes.number,
};
