import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { SubmissionAlert } from 'platform/forms-system/src/js/components/ConfirmationView';
import { scrollTo } from 'platform/utilities/scroll';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { selectProfile } from '~/platform/user/selectors';
import { boardReviewConfirmationLabels } from '../content/boardReview';
import { hearingTypeLabels } from '../content/hearingType';
import {
  wantsToUploadEvidence,
  canUploadEvidence,
  needsHearingType,
  isDirectReview,
} from '../utils/helpers';
import {
  chapterHeaderClass,
  ConfirmationSummary,
  ConfirmationReturnLink,
} from '../../shared/components/ConfirmationSummary';
import { ConfirmationTitle } from '../../shared/components/ConfirmationTitle';
import ConfirmationPersonalInfo from '../../shared/components/ConfirmationPersonalInfo';
import ConfirmationIssues from '../../shared/components/ConfirmationIssues';
import { getReadableDate } from '../../shared/utils/dates';
import { convertBoolResponseToYesNo } from '../../shared/utils/form-data-display';
// import { NOD_PDF_DOWNLOAD_URL } from '../../shared/constants';

export const ConfirmationPageV2 = () => {
  const alertRef = useRef(null);

  const form = useSelector(state => state.form || {});
  const profile = useSelector(state => selectProfile(state));

  useEffect(
    () => {
      if (alertRef?.current) {
        scrollTo('topScrollElement');
        // delay focus for Safari
        waitForRenderThenFocus('#main h2', alertRef.current);
      }
    },
    [alertRef],
  );

  const { submission, data = {} } = form;
  const submitDate = getReadableDate(
    submission?.timestamp || new Date().toISOString(),
  );
  // Fix this after Lighthouse sets up the download URL
  const downloadUrl = ''; // NOD_PDF_DOWNLOAD_URL;

  const choseEvidence = canUploadEvidence(data);
  const choseHearing = needsHearingType(data);
  const choseDirectReview = isDirectReview(data);

  return (
    <>
      <ConfirmationTitle pageTitle="Request a Board Appeal" />
      <SubmissionAlert
        title="Your Board Appeal request submission is in progress"
        content={
          <p>
            You submitted the request on {submitDate}. It can take a few days
            for the Board to receive your request. We’ll send you a confirmation
            letter once we’ve processed your request.
          </p>
        }
      />
      <ConfirmationSummary name="Board Appeal" downloadUrl={downloadUrl} />

      <h2>What to expect next</h2>
      <p>
        We’re reviewing your request for a Board Appeal. If the Board agrees to
        review your case, you’ll get a letter telling you that the Board has
        added your case to the docket. The docket is the list of cases for the
        Board to review.
      </p>
      <p>
        You can check the status of your request in the claims and appeals
        status tool. It may take <strong>7 to 10 days</strong> to appear there.
      </p>
      <p>
        <va-link
          disable-analytics
          href="/claim-or-appeal-status/"
          text="Check the status of your request for a Board Appeal online"
        />
      </p>
      <p>
        If we need more information, we’ll contact you to tell you what other
        information you’ll need to submit.
      </p>

      <h3>What happens after the Board agrees to review your case</h3>
      <div className="board-review-option-info">
        {choseDirectReview && (
          <p>
            The board will consider evidence that is already on your record at
            the time of your appeal.
          </p>
        )}
        {choseEvidence && (
          <>
            <p>
              You have 90 days from the date of the Board’s receipt of your VA
              Form 10182 to submit new evidence.
            </p>
            <p>
              All correspondence, requests, and evidence you send to the Board
              should include your name and VA file number. Mail or fax documents
              to:
            </p>
            <div className="va-address-block">
              <div>Board of Veterans’ Appeals</div>
              <div>PO Box 27063</div>
              <div>Washington, DC 20038</div>
            </div>
            <p>
              <strong>Fax:</strong>{' '}
              <va-telephone not-clickable contact="8446788979" />
            </p>
          </>
        )}
        {choseHearing && (
          <>
            <p>
              You will receive a letter from the Board when your hearing is
              scheduled. While not required, you have the option to submit new
              evidence during your hearing or within 90 days after the date of
              your hearing. Any evidence submitted after the date of the
              decision you are appealing but prior to the date of your hearing
              cannot be considered by the Board. You can start preparing
              evidence now, but you can only submit it during your hearing or
              within 90 days after the date of your hearing. If you do not
              appear for your scheduled hearing, and the hearing is not
              rescheduled, you may submit evidence within 90 days following the
              date of the scheduled hearing.
            </p>
            <p className="vads-u-margin-bottom--0">
              You may also choose to withdraw your hearing request. If you
              withdraw your hearing request, the Board can only consider
              evidence submitted within 90 days following the Board’s receipt of
              your hearing withdrawal.
            </p>
          </>
        )}
      </div>

      <p>
        <va-link
          disable-analytics
          href="/decision-reviews/after-you-request-review/"
          text="Learn more about what happens after you request a review"
        />
      </p>
      <p>
        If you’re worried about how long it’s taking to receive a decision, do
        not create another Board Appeal or other decision review. Duplicate
        decision reviews can delay the process.
      </p>

      <h2>How to contact us if you have questions</h2>
      <p>You can ask us a question online through Ask VA.</p>
      <p>
        <va-link
          disable-analytics
          href="https://ask.va.gov/"
          text="Contact us online through Ask VA"
        />
        .
      </p>
      <p>
        Or call us at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone contact={CONTACTS[711]} tty />
        ).
      </p>

      <h2 className="vads-u-margin-top--4">Your Board Appeal request</h2>

      <ConfirmationPersonalInfo
        dob={profile.dob}
        homeless={data.homeless}
        userFullName={profile.userFullName}
        veteran={data.veteran}
      />

      <ConfirmationIssues
        data={data}
        text="The issues you’re asking the board to review"
      >
        <>
          <li>
            <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
              Are you requesting an extension?
            </div>
            <div
              className="vads-u-margin-bottom--2 dd-privacy-hidden"
              data-dd-action-name="requesting an extension"
            >
              {convertBoolResponseToYesNo(data?.requestingExtension)}
            </div>
          </li>
          {data.requestingExtension && (
            <li>
              <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
                Reason for extension
              </div>
              <div
                className="vads-u-margin-bottom--2 dd-privacy-hidden"
                data-dd-action-name="reason for extension"
              >
                {data.extensionReason}
              </div>
            </li>
          )}
          <li>
            <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
              Are you appealing denial of VA health care benefits?
            </div>
            <div
              className="vads-u-margin-bottom--2 dd-privacy-hidden"
              data-dd-action-name="is appealing VHA benefits"
            >
              {convertBoolResponseToYesNo(data?.appealingVHADenial)}
            </div>
          </li>
        </>
      </ConfirmationIssues>

      <h3 className={chapterHeaderClass}>Board review options</h3>
      {/* Adding a `role="list"` to `ul` with `list-style: none` to work around
          a problem with Safari not treating the `ul` as a list. */}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul className="remove-bullets" role="list">
        <li>
          <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
            Select a Board review option:
          </div>
          <div
            className="vads-u-margin-bottom--2 dd-privacy-hidden"
            data-dd-action-name="board review option"
          >
            {boardReviewConfirmationLabels[data.boardReviewOption] || ''}
          </div>
        </li>
        {choseEvidence && (
          <li>
            <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
              Uploaded evidence
            </div>
            {wantsToUploadEvidence(data) && data.evidence.length ? (
              data.evidence?.map((file, index) => (
                <div
                  key={index}
                  className="vads-u-margin-bottom--2 dd-privacy-hidden"
                  data-dd-action-name="evidence file name"
                >
                  {file.name}
                </div>
              ))
            ) : (
              <span className="evidence-later">I’ll submit it later.</span>
            )}
          </li>
        )}
        {choseHearing && (
          <>
            <li>
              <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
                Hearing Type
              </div>
              <div
                className="vads-u-margin-bottom--2 dd-privacy-hidden"
                data-dd-action-name="hearing type"
              >
                {hearingTypeLabels[data.hearingTypePreference]}
              </div>
            </li>
          </>
        )}
      </ul>

      <ConfirmationReturnLink />
    </>
  );
};

ConfirmationPageV2.propTypes = {
  children: PropTypes.element,
  form: PropTypes.shape({
    data: PropTypes.shape({}),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.instanceOf(Date),
    }),
  }),
};

export default ConfirmationPageV2;
