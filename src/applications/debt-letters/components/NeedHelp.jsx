import React from 'react';
import Telephone, {
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const NeedHelp = () => (
  <div className="vads-u-font-family--sans">
    <h2
      id="howDoIGetHelp"
      className="vads-u-margin-top--4 vads-u-margin-bottom--0"
    >
      How do I get financial help?
    </h2>
    <p className="vads-u-margin-top--2">
      If you need financial help, you can request:
    </p>
    <ul>
      <li>
        An extended monthly payment plan, <strong>or</strong>
      </li>
      <li>
        A compromise (ask us to accept a lower amount of money as full payment
        of the debt), <strong>or</strong>
      </li>
      <li>A waiver (ask us to stop collection on the debt)</li>
    </ul>
    <p>
      You may be required to submit a financial status report. Call the DMC at{' '}
      <Telephone contact="8008270648" /> between 6:30 a.m. and 6:00 p.m. CT to
      discuss your options and next steps. For international callers, use{' '}
      <Telephone contact="6127136415" pattern={PATTERNS.OUTSIDE_US} />
      {'.'}
    </p>
    <a href="https://www.va.gov/debtman/Financial_Status_Report.asp">
      Find information about submitting a financial status report
    </a>
    <h2
      id="howDoIDispute"
      className="vads-u-margin-top--4 vads-u-margin-bottom--0"
    >
      How do I dispute a debt?
    </h2>
    <p className="vads-u-margin-top--2">
      If you think a debt was created in error, you can dispute it. Get
      information about disputing a debt by calling the DMC at{' '}
      <Telephone contact="8008270648" /> between 6:30 a.m. and 6:00 p.m. CT. For
      international callers, use{' '}
      <Telephone contact="6127136415" pattern={PATTERNS.OUTSIDE_US} />
      {'.'}
    </p>
  </div>
);

export default NeedHelp;
