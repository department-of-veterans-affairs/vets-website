import React from 'react';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import ConfirmationDecisionReviews from '../../shared/components/ConfirmationDecisionReviews';

export const ConfirmationPage = () => (
  <ConfirmationDecisionReviews
    pageTitle="Request for Board Appeal"
    alertTitle="We’ve received your Board Appeal request"
  >
    <h2 className="vads-u-font-size--h3">
      After you request a decision review
    </h2>
    <p>
      When we’ve completed your review, we will physically mail you a decision
      packet that includes details about our decision.{' '}
      <a href="/decision-reviews/after-you-request-review/">
        Learn more about what happens after you request a review
      </a>
      .
    </p>

    <h2 className="vads-u-font-size--h3">What should I do while I wait?</h2>
    <p>
      You don’t need to do anything unless we send you a letter asking for more
      information. If we schedule any exams for you, be sure not to miss them.
    </p>
    <p>
      If you requested an appeal and haven’t heard back from us yet, please
      don’t request another appeal. Call us at{' '}
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
      Check the status of your appeal
    </a>
    <p id="delay-note">
      <strong>Note</strong>: It may take 7 to 10 days for your Board Appeal
      request to appear online.
    </p>
  </ConfirmationDecisionReviews>
);

export default ConfirmationPage;
