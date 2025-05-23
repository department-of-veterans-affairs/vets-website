import React from 'react';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { deductionCodes } from '../const/deduction-codes';

export const getDeductionDescription = code => {
  const description = deductionCodes[code];
  if (!description) {
    return '';
  }
  return `– ${description}`;
};

const HowDoIPay = ({ userData }) => {
  const { deductionCode } = userData;

  return (
    <article className="vads-u-padding-x--0">
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
        You’ll need to provide the following details to pay this debt online:
      </p>
      {userData ? (
        <ul>
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
            {userData.deductionCode} {getDeductionDescription(deductionCode)}
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

      <va-additional-info trigger="Here's what the above terms mean:">
        <ul>
          <li>
            <strong>File Number</strong> is your VA claim number. This field
            must be 8 or 9 characters long.
          </li>
          <li>
            <strong>Payee Number</strong> tells us whether the debtor is a
            veteran or service member, a child, a spouse, a vendee or parent of
            the veteran.
          </li>
          <li>
            <strong>Person Entitled</strong> is the first initial, middle
            initial (if there is one) and first four letters of the debtor’s
            last name. If the entry on the collection letter after Person
            Entitled does not have a middle initial, a blank will appear where
            the middle initial would be. Please leave the same space blank on
            this form.
          </li>
          <li>
            <strong>Deduction Code</strong> is a number that tells us what type
            of benefit the debtor received when the debt was established.
          </li>
        </ul>
      </va-additional-info>

      <va-link-action
        href="https://www.pay.va.gov/"
        message-aria-describedby="Opens pay.va.gov"
        text="Pay at pay.va.gov"
        class="vads-u-margin-top--2"
      />

      <h3>Pay by phone</h3>
      <p>
        Call us at <va-telephone contact={CONTACTS.DMC} /> (
        <va-telephone contact={CONTACTS.DMC_OVERSEAS} international /> from
        overseas) (<va-telephone contact="711" tty="true" />
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
        USA
      </p>
    </article>
  );
};

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
