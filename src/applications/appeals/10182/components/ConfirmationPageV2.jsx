import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import scrollTo from '@department-of-veterans-affairs/platform-utilities/scrollTo';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { selectProfile } from '~/platform/user/selectors';

import ConfirmationPersonalInfo from '../../shared/components/ConfirmationPersonalInfo';
import ConfirmationPdfMessages from '../../shared/components/ConfirmationPdfMessages';
import ConfirmationIssues from '../../shared/components/ConfirmationIssues';

import { boardReviewLabels } from '../content/boardReview';
import { hearingTypeLabels } from '../content/hearingType';

import { getReadableDate } from '../../shared/utils/dates';
import { NOD_PDF_DOWNLOAD_URL } from '../../shared/constants';

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

  return (
    <div>
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
      </div>

      <va-alert status="success" ref={alertRef} uswds>
        <h2 slot="headline">
          You submitted your Board Appeal request on {submitDate}
        </h2>
      </va-alert>

      <div className="screen-only">
        <va-summary-box uswds class="vads-u-margin-top--2">
          <h3 slot="headline" className="vads-u-margin-top--0">
            Save a PDF copy of your Board Appeal request
          </h3>
          <p>
            If you’d like to save a PDF copy of your completed Board Appeal
            request for your records, you can download it now.
          </p>
          <p>
            <ConfirmationPdfMessages pdfApi={NOD_PDF_DOWNLOAD_URL} />
          </p>
          <p>
            <strong>Note:</strong> This PDF is for your records only. You’ve
            already submitted your completed Board Appeal request. We ask that
            you don’t send us another copy.
          </p>
        </va-summary-box>

        <h3>Print this confirmation page</h3>
        <p>
          You can print this page, which includes a summary of the information
          you submitted in your Board Appeal request.
        </p>
        <va-button onClick={window.print} text="Print this page" />
      </div>

      <h2 className="vads-u-font-size--h3">What to expect next</h2>
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
        <a href="/claim-or-appeal-status/">
          Check the status of your request for a Board Appeal online
        </a>
      </p>
      <p>
        If we need more information, we’ll contact you to tell you what other
        information you’ll need to submit.
      </p>

      <va-additional-info trigger="What to expect if the Board agrees to review your case">
        <div>
          <p className="vads-u-margin-top--0">
            For <strong>Direct Review</strong>,
          </p>
          <p>
            The board will consider evidence that is already on your record at
            the time of your appeal.
          </p>
          <p>
            For <strong>Evidence Submission</strong>,
          </p>
          <p>
            You have 90 days from the date of the Board’s receipt of your VA
            Form 10182 to submit new evidence.
          </p>
          <p>
            All correspondence, requests, and evidence you send to the Board
            should include your name and VA file number. Mail or fax documents
            to:
          </p>
          <div>Board of Veterans’ Appeals</div>
          <div>P.O. Box 27063</div>
          <div>Washington, DC 20038</div>
          <p>Fax: 1-844-678-8979</p>
          <p>
            For <strong>Hearing</strong>,
          </p>
          <p>
            You will receive a letter from the Board when your hearing is
            scheduled. While not required, you have the option to submit new
            evidence during your hearing or within 90 days after the date of
            your hearing. Any evidence submitted after the date of the decision
            you are appealing but prior to the date of your hearing cannot be
            considered by the Board. You can start preparing evidence now, but
            you can only submit it during your hearing or within 90 days after
            the date of your hearing. If you do not appear for your scheduled
            hearing, and the hearing is not rescheduled, you may submit evidence
            within 90 days following the date of the scheduled hearing.
          </p>
          <p className="vads-u-margin-bottom--0">
            You may also choose to withdraw your hearing request. If you
            withdraw your hearing request, the Board can only consider evidence
            submitted within 90 days following the Board’s receipt of your
            hearing withdrawal.
          </p>
        </div>
      </va-additional-info>

      <p>
        <a href="/decision-reviews/after-you-request-review/">
          Learn more about what happens after you request a review
        </a>
      </p>
      <p>
        If you’re worried about how long it’s taking to receive a decision, do
        not create another Board Appeal or other decision review. Duplicate
        decision reviews can delay the process.
      </p>

      <h2 className="vads-u-font-size--h3">
        How to contact us if you have questions
      </h2>
      <p>You can ask us a question online through Ask VA.</p>
      <p>
        <a href="https://ask.va.gov/">Contact us online through Ask VA.</a>
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

      <ConfirmationIssues data={data} />

      <h3 className="vads-u-margin-top--2">Board review options</h3>
      {/* Adding a `role="list"` to `ul` with `list-style: none` to work around
          a problem with Safari not treating the `ul` as a list. */}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul className="remove-bullets" role="list">
        <li>
          <div className="page-title vads-u-color--gray">
            Select a Board review option:
          </div>
          <div
            className="page-value dd-privacy-hidden"
            data-dd-action-name="board review option"
          >
            {boardReviewLabels[data.boardReviewOption] || ''}
          </div>
        </li>
        {data.boardReviewOption === 'evidence_submission' &&
          data.evidence.length && (
            <li>
              <div className="page-title vads-u-color--gray">
                Uploaded evidence
              </div>
              {data.evidence?.map((file, index) => (
                <div
                  key={index}
                  className="page-value dd-privacy-hidden"
                  data-dd-action-name="evidence file name"
                >
                  {file.name}
                </div>
              ))}
            </li>
          )}
        {data.boardReviewOption === 'hearing' && (
          <>
            <li>
              <div className="page-title vads-u-color--gray">Hearing Type</div>
              <div
                className="page-value dd-privacy-hidden"
                data-dd-action-name="hearing type"
              >
                {hearingTypeLabels[data.hearingTypePreference]}
              </div>
            </li>
          </>
        )}
      </ul>
      <div className="screen-only vads-u-margin-top--4">
        <a className="vads-c-action-link--green" href="/">
          Go back to VA.gov
        </a>
      </div>
    </div>
  );
};

ConfirmationPageV2.propTypes = {
  alertDescription: PropTypes.element,
  alertTitle: PropTypes.string,
  children: PropTypes.array,
  form: PropTypes.shape({
    data: PropTypes.shape({}),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.instanceOf(Date),
    }),
  }),
  name: PropTypes.shape({
    first: PropTypes.string,
    middle: PropTypes.string,
    last: PropTypes.string,
    suffix: PropTypes.string,
  }),
  pageTitle: PropTypes.string,
};

export default ConfirmationPageV2;
