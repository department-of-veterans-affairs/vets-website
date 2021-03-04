import React from 'react';
import { PAGE_NAMES } from '../constants';

const Disagree = () => {
  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
      <p className="vads-u-margin-top--0">
        Based on the information you provided, this isn’t the form you need.
      </p>
      <p className="vads-u-margin-bottom--0">
        <strong>
          If you disagree with the VA decision that resulted in this debt,
        </strong>{' '}
        you can submit a supplemental claim or request a higher level review or
        board appeal.
      </p>
      <p className="vads-u-margin-top--1">
        <a href="/decision-reviews/">Learn more about the VA appeals process</a>
      </p>
      <p className="vads-u-margin-bottom--0">
        <strong>If you need more help, </strong>
        call your VA benefit office.
      </p>
      <p className="vads-u-margin-top--1">
        <a href="/resources/helpful-va-phone-numbers/">
          Find helpful VA phone numbers
        </a>
      </p>
      <h3>What to know about debt waivers</h3>
      <p>
        You have <strong>180 days</strong> from the date you received your first
        debt letter to request a debt waiver. A waiver is a request to ask us to
        stop collection on your debt.
      </p>
      <p className="vads-u-margin-bottom--0">
        If you’re worried that we won’t complete your appeal before the 180-day
        limit, you can request a waiver with our online Financial Status Report
        (VA Form 5655).
      </p>
      <p className="vads-u-margin-top--1">
        <a href="https://www.va.gov/debtman/Financial_Status_Report.asp">
          Request help with VA Form 5655
        </a>
      </p>
      <p>
        <strong>Note: </strong>
        We’ll continue to add late fees and interest, and take other collection
        action as needed, while we consider your appeal.
      </p>
    </div>
  );
};

export default {
  name: PAGE_NAMES.disagree,
  component: Disagree,
};
