import React from 'react';
import { PAGE_NAMES } from '../constants';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';
import ContactDMC from '../components/Contacts';

const Dependents = () => (
  <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
    <p className="vads-u-margin-top--0">
      Based on the information you provided, this isn’t the form you need.
    </p>
    <p>
      <strong>
        Here’s how to request help with debt for spouses or dependents:
      </strong>
    </p>
    <p>
      To request help with VA education, disability compensation, or pension
      benefit debt, fill out the PDF version of our{' '}
      <a href="https://www.va.gov/debtman/Financial_Status_Report.asp">
        Financial Status Report (VA Form 5655).
      </a>
    </p>
    <p>
      You can use this form to request a debt waiver, compromise offer, or
      extended monthly payment plan. You’ll also need to include a personal
      statement to tell us why it’s hard for you to repay the debt.
    </p>
    <p>Submit your completed, signed form and statement by mail or fax.</p>
    <ul>
      <li>
        <strong>Mail: </strong>
        <div>Debt Management Center</div>
        <div>P.O. Box 11930</div>
        <div>St. Paul, MN 55111-0930</div>
      </li>
      <li>
        <strong>Fax: </strong>
        <Telephone contact={'1-612-970-5688'} />
      </li>
    </ul>
    <p>
      <strong>If you submitted VA Form 5655 in the past 6 months</strong>
    </p>
    <p>
      You don’t need to submit a new request unless you have changes to report.{' '}
      <ContactDMC />
    </p>
  </div>
);

export default {
  name: PAGE_NAMES.dependents,
  component: Dependents,
};
