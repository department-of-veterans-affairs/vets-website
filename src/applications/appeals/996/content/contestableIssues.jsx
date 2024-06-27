import React from 'react';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const disabilitiesList = (
  <div>
    <p className="vads-u-margin-top--0">
      Your issue may not be eligible for review if any of these descriptions are
      true:
    </p>
    <p>
      We made the decision over a year ago. You have 1 year from the date on
      your decision letter to request a Higher-Level Review
    </p>
    <p>
      Our decision is about a benefit type other than disability compensation or
      pension. To request a Higher-Level Review for a decision about another
      benefit type, you’ll need to fill out VA Form 20-0996 and submit it by
      mail or in person.
    </p>
    <p>
      <a href="/find-forms/about-form-20-0996" target="_blank">
        Get VA Form 20-0996 to download (opens in new tab)
      </a>
    </p>
    <p>
      You and another surviving dependent of the Veteran are claiming a benefit
      that only one person can claim (also called a contested claim). You’ll
      need to{' '}
      <a href="/decision-reviews/board-appeal" target="_blank">
        appeal to the Board of Veterans’ Appeals (opens in a new tab)
      </a>
      .
    </p>
    <p>
      <a href="/decision-reviews/contested-claims" target="_blank">
        Learn more about contested claims (opens in a new tab)
      </a>
    </p>
    <p>
      You already have a Higher-Level Review decision on the issue. If you
      disagree with a Higher-Level Review decision, you can file a{' '}
      <a href="/decision-reviews/supplemental-claim" target="_blank">
        Supplemental Claim (opens in a new tab)
      </a>{' '}
      and submit new evidence, or request Board Appeal.
    </p>
    <p>
      To learn more about decision review options, visit our decision reviews
      and appeals information page.
    </p>
    <p>
      <a href="/resources/choosing-a-decision-review-option" target="_blank">
        Learn more about decision review options (opens in a new tab)
      </a>
    </p>
    <p>
      If you need help, call us at{' '}
      <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
      <va-telephone contact={CONTACTS['711']} tty />
      ). You can also appoint an accredited representative to get help with your
      claim.
    </p>
    <p className="vads-u-margin-bottom--0">
      <a href="/get-help-from-accredited-representative" target="_blank">
        Get help from an accredited representative (opens in a new tab)
      </a>
    </p>
  </div>
);

export const disabilitiesExplanation = (
  <va-additional-info
    trigger="Why isn’t my issue listed here?"
    class="vads-u-margin-bottom--6"
  >
    {disabilitiesList}
  </va-additional-info>
);
