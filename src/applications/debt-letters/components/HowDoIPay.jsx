import React from 'react';
import { Link } from 'react-router';
import Telephone, {
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const HowDoIPay = () => (
  <div className="vads-u-font-family--sans">
    <h2 id="howDoIPay" className="vads-u-margin-top--4 vads-u-margin-bottom-2">
      How do I pay my VA debt?
    </h2>
    <p className="vads-u-margin-top--0">
      You can pay your debt online, by phone, or by mail. If you can't pay all
      of your debt or if you currently receive monthly benefits, call the Debt
      Management Center at <Telephone contact="8008270648" />
      {'.'}
    </p>
    <h3 className="vads-u-margin-top--1">Online</h3>
    <p className="vads-u-margin-top--0">
      Pay directly from your bank account or by debit or credit card on the
      secure <a href="https://www.pay.va.gov/">pay.va.gov</a> website.
    </p>
    <h3 className="vads-u-margin-top--1">By phone</h3>
    <p className="vads-u-margin-bottom--0 vads-u-margin-top--0">
      Call us at <Telephone contact="8008270648" />
      {'.'}
    </p>
    <p className="vads-u-margin-top--1">
      If calling internationally, use{' '}
      <Telephone contact="6127136415" pattern={PATTERNS.OUTSIDE_US} />
      {'.'}
    </p>
    <h3 className="vads-u-margin-top--1">By mail</h3>
    <p className="vads-u-margin-y--0">
      Find instructions on how to pay by mail in the demand letter sent to your
      address or you can <Link to="/debt-letters">download them online</Link>.
    </p>
  </div>
);

export default HowDoIPay;
