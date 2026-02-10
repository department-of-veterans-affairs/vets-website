import React from 'react';
import { useSelector } from 'react-redux';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { resetStoredSubTask } from '@department-of-veterans-affairs/platform-forms/sub-task';
import { SubmissionAlert } from 'platform/forms-system/src/js/components/ConfirmationView';
import { selectProfile } from 'platform/user/selectors';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

// Content
import { title995 } from '../content/title';
import { PrivateDetailsDisplay } from './evidence/PrivateDetailsDisplay';
import { EvidenceUploadContent } from './EvidenceUploadContent';
import { VaDetailsDisplay } from './evidence/VaDetailsDisplay';
import { content as notice5103Content } from '../content/notice5103';
import { facilityTypeTitle, facilityTypeList } from '../content/facilityTypes';
import { content as evidenceContent } from '../content/evidence/summary';
import { optionForMstTitle } from '../content/optionForMst';
import {
  optionIndicatorLabel,
  optionIndicatorChoices,
} from '../content/optionIndicator';

// Utils
import {
  getVAEvidence,
  getPrivateEvidence,
  getOtherEvidence,
} from '../utils/form-data-retrieval';
import { HAS_PRIVATE_LIMITATION } from '../constants';
import { getReadableDate } from '../../shared/utils/dates';

// Components
import {
  chapterHeaderClass,
  ConfirmationSummary,
  ConfirmationReturnLink,
} from '../../shared/components/ConfirmationSummary';
import { ConfirmationAlert } from '../../shared/components/ConfirmationAlert';
import { ConfirmationTitle } from '../../shared/components/ConfirmationTitle';
import ConfirmationPersonalInfo from '../../shared/components/ConfirmationPersonalInfo';
import ConfirmationIssues from '../../shared/components/ConfirmationIssues';
import { LivingSituation } from './LivingSituation';
import { convertBoolResponseToYesNo } from '../../shared/utils/form-data-display';

export const ConfirmationPage = () => {
  resetStoredSubTask();

  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const myVADisplayEnabled = useToggleValue(
    TOGGLE_NAMES.decisionReviewsMyVADisplay,
  );

  const form = useSelector(state => state.form || {});
  const profile = useSelector(state => selectProfile(state));

  // Fix this after Lighthouse sets up the download URL
  const downloadUrl = ''; // SC_PDF_DOWNLOAD_URL;

  const { submission, data = {} } = form; // maxData;

  const vaEvidence = getVAEvidence(data);
  const privateEvidence = getPrivateEvidence(data);
  const otherEvidence = getOtherEvidence(data);
  const noEvidence =
    vaEvidence.length + privateEvidence.length + otherEvidence.length === 0;

  const submitDate = getReadableDate(
    submission?.timestamp || new Date().toISOString(),
  );

  return (
    <>
      <ConfirmationTitle pageTitle={title995} />
      {myVADisplayEnabled && (
        <SubmissionAlert
          title="Your Supplemental Claim submission is in progress"
          content={
            <p>
              You submitted the request on {submitDate}. It can take a few days
              for us to receive your request. We’ll send you a confirmation
              letter once we’ve processed your request.
            </p>
          }
        />
      )}
      {!myVADisplayEnabled && (
        <ConfirmationAlert alertTitle="Your Supplemental Claim submission is in progress">
          <p>
            You submitted the request on {submitDate}. It can take a few days
            for us to receive your request. We’ll send you a confirmation letter
            once we’ve processed your request.
          </p>
        </ConfirmationAlert>
      )}
      <ConfirmationSummary
        name="Supplemental Claim"
        downloadUrl={downloadUrl}
      />
      <h2>What to expect next</h2>
      <p>
        If we need more information, we’ll contact you to tell you what other
        information you’ll need to submit. We’ll also tell you if we need to
        schedule an exam for you.
      </p>
      <p>
        When we’ve completed your review, we’ll mail you a decision packet with
        the details of our decision.{' '}
        <va-link
          disable-analytics
          href="/decision-reviews/after-you-request-review/"
          text="Learn more about what happens after you request a decision review"
        />
      </p>
      <p>
        <strong>Note:</strong> You can choose to have a hearing at any point in
        the claims process. Contact us online through Ask VA to request a
        hearing.
      </p>
      <p>
        You can check the status of your request in the claims and appeals
        status tool. It may take <strong>7 to 10 days</strong> to appear there.
      </p>
      <p>
        <va-link
          href="/claim-or-appeal-status/"
          text="Check the status of your Supplemental Claim online"
        />
      </p>

      <h2>How to contact us if you have questions</h2>
      <p>You can ask us a question online through Ask VA.</p>
      <p>
        <va-link
          href="https://ask.va.gov/"
          text="Contact us online through Ask VA."
        />
      </p>
      <p>
        Or call us at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone contact={CONTACTS[711]} tty />
        ).
      </p>
      <p>
        <strong>
          If you don’t hear back from us about your Supplemental Claim
        </strong>
        , don’t request a Supplemental Claim again or another type of decision
        review. Contact us online or call us instead.
      </p>
      <h2 className="vads-u-margin-top--4">Your Supplemental Claim request</h2>
      <ConfirmationPersonalInfo
        dob={profile.dob}
        formData={data}
        hasHomeAndMobilePhone
        livingSituation={<LivingSituation data={data} />}
        userFullName={profile.userFullName}
        veteran={data.veteran}
      />
      <ConfirmationIssues data={data} />
      <h3 className={chapterHeaderClass}>New and relevant evidence</h3>
      {/* Adding a `role="list"` to `ul` with `list-style: none` to work around
          a problem with Safari not treating the `ul` as a list. */}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul className="remove-bullets" role="list">
        <li>
          <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
            {notice5103Content.label}
          </div>
          <div
            className="vads-u-margin-bottom--2 dd-privacy-hidden"
            data-testid="confirmation-form-5103"
            data-dd-action-name="notice 5103 reviewed"
          >
            {data.form5103Acknowledged
              ? 'Yes, I certify'
              : 'No, I didn’t certify'}
          </div>
        </li>
        <li>
          <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
            {facilityTypeTitle}
          </div>
          <div
            className="vads-u-margin-bottom--2 dd-privacy-hidden"
            data-testid="confirmation-facility-types"
            data-dd-action-name="facility types selected"
          >
            {facilityTypeList(data.facilityTypes) || 'None selected'}
          </div>
        </li>
      </ul>
      {noEvidence && (
        <>
          <h3
            data-testid="confirmation-no-evidence-header"
            className={chapterHeaderClass}
          >
            {evidenceContent.summaryTitle}
          </h3>
          <div className="no-evidence">
            {evidenceContent.missingEvidenceReviewText}
          </div>
        </>
      )}
      {vaEvidence.length ? (
        <VaDetailsDisplay list={vaEvidence} reviewMode showListOnly />
      ) : null}
      {privateEvidence.length ? (
        <PrivateDetailsDisplay
          list={privateEvidence}
          limitedConsent={data?.limitedConsent}
          privacyAgreementAccepted={data.privacyAgreementAccepted}
          reviewMode
          showListOnly
          limitedConsentResponse={data?.[HAS_PRIVATE_LIMITATION]}
        />
      ) : null}
      {otherEvidence.length ? (
        <EvidenceUploadContent list={otherEvidence} reviewMode showListOnly />
      ) : null}
      <h3 className={chapterHeaderClass}>VHA indicator</h3>
      {/* Adding a `role="list"` to `ul` with `list-style: none` to work around
              a problem with Safari not treating the `ul` as a list. */}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul className="remove-bullets vads-u-margin-bottom--4" role="list">
        <li className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
          <p className="vads-u-margin-top--0 vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
            {optionForMstTitle}
          </p>
          <p
            className="vads-u-margin-top--0 vads-u-margin-bottom--2 dd-privacy-hidden"
            data-testid="confirmation-mst-response"
            data-dd-action-name="option for MST"
          >
            {convertBoolResponseToYesNo(data.mstOption)}
          </p>
        </li>
        {data.mstOption && (
          <li>
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
              {optionIndicatorLabel}
            </p>
            <p
              className="vads-u-margin-top--0 vads-u-margin-bottom--2 dd-privacy-hidden"
              data-testid="confirmation-mst-option-indicator"
              data-dd-action-name="MST option indicator"
            >
              {optionIndicatorChoices[data.optionIndicator] ?? 'None selected'}
            </p>
          </li>
        )}
      </ul>
      <ConfirmationReturnLink />
    </>
  );
};

export default ConfirmationPage;
