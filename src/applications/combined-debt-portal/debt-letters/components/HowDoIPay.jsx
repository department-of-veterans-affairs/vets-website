import React from 'react';
import PropTypes from 'prop-types';

const HowDoIPay = ({ userData }) => (
  <>
    <article className="vads-u-font-family--sans vads-u-padding-x--0">
      <h2
        id="howDoIPay"
        className="vads-u-margin-top--4 vads-u-margin-bottom-2"
      >
        How to pay your VA debt
      </h2>

      <h3>Pay online</h3>
      <p>
        You can pay directly from your bank account or by debit or credit card
        on the secure{' '}
        <a
          aria-label="Pay.gov - Opens in new window"
          target="_blank"
          href="https://www.pay.va.gov/"
          rel="noreferrer"
        >
          pay.va.gov
        </a>{' '}
        website.
      </p>
      <p>
        You will need to provide the following details to pay this debt online:
      </p>
      {userData ? (
        <ul className="no-bullets">
          <li>
            <strong>File Number: </strong>
            {userData.fileNumber}
          </li>
          <li>
            <strong>Payee Number: </strong>
            {userData.payeeNumber}
          </li>
          <li>
            <strong>Person Entitled: </strong>
            {userData.personEntitled}
          </li>
          <li>
            <strong>Deduction Code: </strong>
            {userData.deductionCode}
          </li>
        </ul>
      ) : (
        <ul>
          <li>File Number</li>
          <li>Payee Number</li>
          <li>Person Entitled</li>
          <li>Deduction Code</li>
        </ul>
      )}

      <va-link-action
        href="https://www.pay.va.gov/"
        message-aria-describedby="Opens pay.va.gov"
        text="Pay on pay.va.gov"
      />

      <h3>Pay by phone</h3>
      <p>
        Call us at <va-telephone contact="8008270648" /> (
        <va-telephone contact="6127136415" /> from overseas) (
        <va-telephone contact="711" tty="true" />
        ). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
      </p>

      <h3>Pay by mail</h3>
      <p>
        Send a separate check or money order for each debt, payable to “U.S.
        Department of Veterans Affairs.” On each, print your full name, VA file
        number or Social Security number, and deduction code. Include your
        payment stubs or a note with the amount you’re paying on each debt.
      </p>
      <p>Mail to this address:</p>
      <p className="va-address-block">
        U.S. Department of Veterans Affairs
        <br />
        Debt Management Center
        <br />
        P.O. Box 11930
        <br />
        St. Paul, MN 55111
        <br />
        United States of America
      </p>
    </article>
  </>
);

HowDoIPay.propTypes = {
  showDebtLetterDownload: PropTypes.bool,
  userData: PropTypes.shape({
    fileNumber: PropTypes.string,
    payeeNumber: PropTypes.string,
    personEntitled: PropTypes.string,
    deductionCode: PropTypes.string,
  }),
};

export default HowDoIPay;
