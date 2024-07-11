import React from 'react';

import { HLR_INFO_URL, GET_HELP_REP_OR_VSO_URL } from '../constants';

export const introText = (
  <p className="va-introtext">
    If you disagree with a VA decision on an initial claim or Supplemental
    Claim, you or your representative can request a Higher-Level Review of the
    decision. You can’t submit new evidence with a Higher-Level Review.
  </p>
);

export const processListTitle = 'Follow the steps to get started';
export const processList = (
  <va-process-list class="vads-u-padding-bottom--0">
    <va-process-list-item header="Check if this is the right decision review option for you">
      <p>
        You can request a Higher-Level Review of an initial claim or
        Supplemental Claim decision. You have 1 year from the date on your
        decision letter to request a Higher-Level Review.
      </p>
      <p>You can’t submit new evidence with a Higher-Level Review.</p>
      <p>
        <strong>Note:</strong> To avoid potential delays, you may include a
        written statement instead of requesting an informal conference. You can
        only include a written statement when submitting your request by mail at
        this time.
      </p>
      <p>
        <a href={HLR_INFO_URL}>
          Find out if a Higher-Level Review is an option for you.
        </a>
      </p>
    </va-process-list-item>
    <va-process-list-item header="Gather your information">
      <p>Here’s what you’ll need to request a Higher-Level Review:</p>
      <ul>
        <li>
          The issues you want us to review and the decision date for each. You
          can ask us to review more than 1 issue.
        </li>
        <li>Your contact information</li>
      </ul>
    </va-process-list-item>
    <va-process-list-item header="Start your request">
      <p>
        We’ll take you through each step of the process. It takes about 15
        minutes.
      </p>
      <p>
        If you need help requesting a Higher-Level Review, you can appoint an
        accredited representative or Veterans Service Organization (VSO) to work
        with us on your behalf.
      </p>
      <p>
        <a href={GET_HELP_REP_OR_VSO_URL}>
          Get help requesting a Higher-Level Review
        </a>
      </p>
      <va-additional-info trigger="What happens after you submit your request?">
        <div>
          You don’t need to do anything unless we send you a letter asking for
          more information. If we schedule any exams for you, be sure not to
          miss them.
        </div>
      </va-additional-info>
    </va-process-list-item>
  </va-process-list>
);
