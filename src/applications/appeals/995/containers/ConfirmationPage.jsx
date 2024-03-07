import React from 'react';

import { resetStoredSubTask } from 'platform/forms/sub-task';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import ConfirmationDecisionReviews from '../../shared/components/ConfirmationDecisionReviews';

export const ConfirmationPage = () => {
  resetStoredSubTask();

  return (
    <ConfirmationDecisionReviews
      pageTitle="File a Supplemental Claim"
      alertTitle="Thank you for filing a Supplemental Claim"
    >
      <h3>What to expect next</h3>
      <p>
        If we need more information, we’ll contact you to tell you what other
        information you’ll need to submit. We’ll also tell you if we need to
        schedule an exam for you.
      </p>
      <p>
        When we’ve completed your review, we’ll mail you a decision packet with
        the details of our decision.{' '}
        <a href="/decision-reviews/after-you-request-review/">
          Learn more about what happens after you request a review
        </a>
        .
      </p>
      <p>
        If you requested a decision review and haven’t heard back from us yet,
        please don’t request another review. Call us instead.
      </p>
      <p>
        Note: You can choose to have a hearing at any point in the claims
        process. Contact us online through Ask VA to request a hearing.{' '}
        <a href="https://ask.va.gov/">Contact us through Ask VA</a>
      </p>
      <p>
        You can also call us at <va-telephone contact={CONTACTS.VA_BENEFITS} />{' '}
        (<va-telephone contact={CONTACTS[711]} tty />
        ).
      </p>
      <br role="presentation" />
      <a
        href="/claim-or-appeal-status/"
        className="vads-c-action-link--green"
        aria-describedby="delay-note"
      >
        Check the status of your claim
      </a>
      <p id="delay-note">
        <strong>Note</strong>: It may take 7 to 10 days for your Supplemental
        Claim request to appear online.
      </p>
    </ConfirmationDecisionReviews>
  );
};

export default ConfirmationPage;
