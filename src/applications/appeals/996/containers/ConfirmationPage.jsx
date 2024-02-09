import React, { useEffect, useRef } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { selectProfile } from 'platform/user/selectors';
import scrollTo from 'platform/utilities/ui/scrollTo';
import { waitForRenderThenFocus } from 'platform/utilities/ui';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { SAVED_CLAIM_TYPE, WIZARD_STATUS } from '../constants';

import { DateSubmitted } from '../../shared/components/DateSubmitted';
import { IssuesSubmitted } from '../../shared/components/IssuesSubmitted';
import { getIssuesListItems } from '../../shared/utils/issues';

export const ConfirmationPage = () => {
  const alertRef = useRef(null);

  const form = useSelector(state => state.form || {});
  const name = useSelector(state => selectProfile(state)?.userFullName || {});

  useEffect(
    () => {
      if (alertRef?.current) {
        scrollTo('topScrollElement');
        // delay focus for Safari
        waitForRenderThenFocus('h2', alertRef.current);
        // reset the wizard
        window.sessionStorage.removeItem(WIZARD_STATUS);
        window.sessionStorage.removeItem(SAVED_CLAIM_TYPE);
      }
    },
    [alertRef],
  );

  const { submission, data } = form;
  const issues = data ? getIssuesListItems(data) : [];
  const fullName = `${name.first || ''} ${name.middle || ''} ${name.last ||
    ''}`.trim();
  const submitDate = moment(submission?.timestamp);

  return (
    <div>
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
        <h2>Request for Higher-Level Review</h2>
      </div>
      <va-alert status="success" ref={alertRef} uswds>
        <h2 slot="headline">We’ve received your Higher-Level Review</h2>
        <p>
          After we’ve completed our review, we’ll mail you a decision packet
          with the details of our decision.
        </p>
      </va-alert>
      <div className="inset">
        <h3 className="vads-u-margin-top--0">
          Your information for this claim
        </h3>
        <h4>Your name</h4>
        {fullName ? (
          <div
            className="dd-privacy-hidden"
            data-dd-action-name="Veteran full name"
          >
            {fullName}
            {name.suffix ? `, ${name.suffix}` : null}
          </div>
        ) : null}

        {submitDate.isValid() && <DateSubmitted submitDate={submitDate} />}
        <IssuesSubmitted issues={issues} />
      </div>

      <h2 className="vads-u-font-size--h3">
        After you request a decision review
      </h2>
      <p>
        When your review is complete, VA will mail you a decision packet that
        includes details about the decision on your case.{' '}
        <a href="/decision-reviews/after-you-request-review/">
          Learn more about what happens after you request a review
        </a>
        .
      </p>

      <h2 className="vads-u-font-size--h3">What should I do while I wait?</h2>
      <p>
        You don’t need to do anything unless VA sends you a letter asking for
        more information. If VA schedules any exams for you, be sure not to miss
        them.
      </p>
      <p>
        If you requested a decision review and haven’t heard back from VA yet,
        please don’t request another review. Call VA at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone contact={CONTACTS[711]} tty />
        ).
      </p>
      <br role="presentation" />
      <a
        href="/claim-or-appeal-status/"
        className="vads-c-action-link--green"
        aria-describedby="delay-note"
      >
        Check the status of your decision review
      </a>
      <p id="delay-note">
        <strong>Note</strong>: It may take 7 to 10 days for your Higher-Level
        Review request to appear online.
      </p>
    </div>
  );
};

ConfirmationPage.propTypes = {
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
};

export default ConfirmationPage;
