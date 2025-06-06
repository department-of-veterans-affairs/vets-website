import React from 'react';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const disabilitiesList = (
  <div>
    <p className="vads-u-margin-top--0">
      Your issue may not be eligible for review if any of these descriptions are
      true:
    </p>
    <ul>
      <li>
        We made the decision over a year ago. You have 1 year from the date on
        your decision letter to request a Higher-Level Review
      </li>
      <li>
        Our decision is about a benefit type other than disability compensation
        or pension. To request a Higher-Level Review for a decision about
        another benefit type, you’ll need to fill out VA Form 20-0996 and submit
        it by mail or in person.
        <p>
          <va-link
            disable-analytics
            href="/find-forms/about-form-20-0996"
            external
            text="Get VA Form 20-0996 to download"
          />
        </p>
      </li>
      <li>
        You and another surviving dependent of the Veteran are claiming a
        benefit that only one person can claim (also called a contested claim).
        You’ll need to{' '}
        <va-link
          disable-analytics
          href="/decision-reviews/board-appeal"
          external
          text="appeal to the Board of Veterans’ Appeals"
        />
        .
        <p>
          <va-link
            disable-analytics
            href="/decision-reviews/contested-claims"
            external
            text="Learn more about contested claims"
          />
        </p>
      </li>
      <li>
        You already have a Higher-Level Review decision on the issue. If you
        disagree with a Higher-Level Review decision, you can file a{' '}
        <va-link
          disable-analytics
          href="/decision-reviews/supplemental-claim"
          external
          text="Supplemental Claim"
        />{' '}
        and submit new evidence, or request a Board Appeal.
        <p>
          To learn more about decision review options, visit our decision
          reviews and appeals information page.
        </p>
        <p>
          <va-link
            disable-analytics
            href="/resources/choosing-a-decision-review-option"
            external
            text="Learn more about decision review options"
          />
        </p>
      </li>
    </ul>
    <p>
      If you need help, call us at{' '}
      <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
      <va-telephone contact={CONTACTS['711']} tty />
      ). You can also appoint an accredited representative to get help with your
      claim.
    </p>
    <p className="vads-u-margin-bottom--0">
      <va-link
        disable-analytics
        href="/get-help-from-accredited-representative"
        external
        text="Get help from an accredited representative"
      />
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
