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
    <section>
      <h2
        id="howDoIPay"
        className="vads-u-margin-top--4 vads-u-margin-bottom-2"
      >
        How to make a payment
      </h2>

      <h3>Pay online</h3>
      <p>
        You can pay directly from your bank account. Or by debit or credit card
        on the secure pay.va.gov website.
      </p>
      <p>
        You’ll need to provide the following details to pay this debt online:
      </p>
      {userData ? (
        <ul>
          <li>
            <strong>
              {userData.receivableId ? 'Receivable ID' : 'File Number'}:{' '}
            </strong>
            {userData.receivableId || userData.fileNumber}
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

      <va-accordion open-single>
        <va-accordion-item
          header="Review what these terms mean"
          id="first"
          bordered
        >
          <ul>
            <li>
              <strong>
                {userData.receivableId ? 'Receivable ID' : 'File Number'}
              </strong>{' '}
              {userData.receivableId
                ? `is a 9-15 digit debt-specific ID number unique to
              your education debt, providing enhanced security.`
                : `is your
              VA claim number. This field must be 8 or 9 characters long.`}
            </li>
            <li>
              <strong>Payee Number</strong> tells us whether the debtor is a
              Veteran, a service member, a child, a spouse, a vendee, or a
              parent of the Veteran.
            </li>
            <li>
              <strong>Person Entitled</strong> is the first initial, middle
              initial (if there is one), and first four letters of the debtor’s
              last name. If the Person Entitled doesn’t have a middle initial,
              that space will be left blank.
            </li>
            <li>
              <strong>Deduction Code</strong> is a number that tells us what
              type of benefit the debtor received when the debt was established.
            </li>
          </ul>
        </va-accordion-item>
      </va-accordion>

      <br />
      <va-icon icon="navigate_next" class="icon-action" size="3" />
      <va-link
        aria-label="Opens pay.va.gov in a new tab"
        external
        text="Pay at pay.va.gov"
        href="https://www.pay.va.gov/"
        class="vads-u-margin-top--2 vads-u-font-weight--bold"
      />

      <h3>Pay by phone</h3>
      <p>
        Call us at <va-telephone contact={CONTACTS.DMC} /> (
        <va-telephone contact="711" tty="true" />
        ). If you’re outside the U.S., call{' '}
        <va-telephone contact={CONTACTS.DMC_OVERSEAS} international />. We’re
        here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
      </p>

      <h3>Pay by mail</h3>
      <p>
        Send a separate check or money order for each debt, payable to "U.S.
        Department of Veterans Affairs." On each, print your full name,{' '}
        {userData?.receivableId
          ? 'receivable ID'
          : 'VA file number or Social Security number'}
        , and deduction code. Include your payment stubs or a note with the
        amount you’re paying on each debt.
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
    </section>
  );
};

HowDoIPay.propTypes = {
  showDebtLetterDownload: PropTypes.bool,
  userData: PropTypes.shape({
    fileNumber: PropTypes.string,
    payeeNumber: PropTypes.string,
    personEntitled: PropTypes.string,
    deductionCode: PropTypes.string,
    receivableId: PropTypes.string,
  }),
};

export default HowDoIPay;
