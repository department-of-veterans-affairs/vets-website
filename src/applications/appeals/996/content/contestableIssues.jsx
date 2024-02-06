import React from 'react';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import {
  BOARD_APPEALS_URL,
  COVID_FAQ_URL,
  DECISION_REVIEWS_URL,
} from '../constants';
import DownloadLink from './DownloadLink';

const disabilitiesList = (
  <div>
    <p>Your issue may not be eligible for review if:</p>
    <ul>
      <li>
        We made the decision over a year ago. You have 1 year from the date on
        your decision letter to request a Higher-Level Review.{' '}
        <strong>Note:</strong> If you aren’t able to request a timely review due
        to COVID-19, we may grant you a deadline extension. To request an
        extension, fill out and submit VA Form 20-0996, with a note attached
        that you’re requesting an extension due to COVID-19.
      </li>
      <li>
        Your issue is for a benefit type other than compensation or pension. To
        request a Higher-Level Review for another benefit type, you’ll need to
        fill out VA Form 20-0996 and submit it by mail or in person.
      </li>
      <li>
        The issue or decision isn’t in our system yet. You’ll need to fill out
        VA Form 20-0996 and submit it by mail or in person.
      </li>
      <li>
        You and another surviving dependent of the Veteran are applying for the
        same benefit. And by law, only 1 of you can receive that benefit. You’ll
        need to{' '}
        <a href={BOARD_APPEALS_URL}>appeal to the Board of Veterans’ Appeals</a>
        .
      </li>
      <li>
        You’re requesting a review of a Board of Veterans’ Appeals decision.
        Refer to your decision notice for your options.
      </li>
      <li>
        You’re requesting a review of a Higher-Level Review decision. You’ll
        need to either file a Supplemental Claim or appeal to the Board of
        Veterans’ Appeals.
      </li>
    </ul>
    <p>
      <DownloadLink content="Download VA Form 20-0996" />
    </p>
    <p className="vads-u-margin-top--2p5">
      To learn more about how COVID-19 may affect claims or appeals, please
      visit our <a href={COVID_FAQ_URL}>coronavirus FAQ page</a>.
    </p>
    <p className="vads-u-padding-bottom--2p5">
      To learn more about decision review options, please visit our{' '}
      <a href={DECISION_REVIEWS_URL}>decision reviews and appeals</a>{' '}
      information page. You can call us at{' '}
      <va-telephone contact={CONTACTS.VA_BENEFITS} /> or work with an accredited
      representative to{' '}
      <a href="/disability/get-help-filing-claim/">get help with your claim</a>.
    </p>
  </div>
);

export const disabilitiesExplanation = (
  <va-additional-info trigger="Why isn’t my issue listed here?" uswds>
    {disabilitiesList}
  </va-additional-info>
);
