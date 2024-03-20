import React, { useEffect } from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { SAVED_CLAIM_TYPE, WIZARD_STATUS } from '../constants';

import ConfirmationDecisionReviews from '../../shared/components/ConfirmationDecisionReviews';

export const ConfirmationPage = () => {
  useEffect(() => {
    // reset the wizard
    window.sessionStorage.removeItem(WIZARD_STATUS);
    window.sessionStorage.removeItem(SAVED_CLAIM_TYPE);
  });

  return (
    <ConfirmationDecisionReviews
      pageTitle="Request a Higher-Level Review"
      alertTitle="We’ve received your Higher-Level Review"
    >
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
    </ConfirmationDecisionReviews>
  );
};

export default ConfirmationPage;
