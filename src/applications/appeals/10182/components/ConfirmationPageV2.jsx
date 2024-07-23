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
        waitForRenderThenFocus('h2', alertRef.current);
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
        <p>
          It may take 7 to 10 days to show up in your list of claims and
          appeals.
        </p>
      </va-alert>

      <div className="screen-only">
        <va-summary-box uswds class="vads-u-margin-top--2">
          <h3 slot="headline" className="vads-u-margin-top--0">
            Save a PDF copy of your Board Appeal
          </h3>
          <p>
            If you’d like a PDF copy of your completed Board Appeal, you can
            download it.
          </p>
          <ConfirmationPdfMessages pdfApi={NOD_PDF_DOWNLOAD_URL} />
        </va-summary-box>

        <h3>Print this confirmation page</h3>
        <p>
          If you’d like to keep a copy of the information on this page, you can
          print it now.{' '}
        </p>
        <va-button onClick={window.print} text="Print this page" />
      </div>

      <h2 className="vads-u-font-size--h3">What to expect next</h2>
      <p>
        Your completed form will be submitted to the intake team. If your
        request is accurate and complete, you’ll be in line for review, and your
        request will show up in the status tool.{' '}
        <strong>Intake may take 7 to 10 days.</strong>
      </p>
      <p>
        <a href="/claim-or-appeal-status/">
          Check your claims and appeals status online
        </a>
      </p>
      <p>
        If we need more information, we’ll contact you to tell you what other
        information you’ll need to submit. We’ll also tell you if we need to
        schedule an exam or hearing for you. After we’ve completed our review,
        we’ll mail you a decision packet with the details of our decision.
      </p>
      <p>
        <strong>If you don’t hear back from us about your Board Appeal</strong>,
        don’t file another claim or request another type of decision review.
        Contact us online or call us instead.
      </p>
      <p>
        <a href="/decision-reviews/after-you-request-review/">
          Learn more about what happens after you request a review
        </a>
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

      <h2 className="vads-u-margin-top--4">
        You submitted the following information for the Board Appeal
      </h2>

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
