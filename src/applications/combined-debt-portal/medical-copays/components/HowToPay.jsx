import React from 'react';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import CopyButton from '../../combined/components/CopyButton';

const splitAccountNumber = accountNumber => {
  const parts = accountNumber?.split(/\s+/) || [];
  return Array.from({ length: 5 }, (_, i) => parts[i] || '');
};

export const HowToPay = ({
  isOverview,
  acctNum,
  facility,
  amtDue,
  lightHouseFacilityName,
}) => {
  const accountParts = splitAccountNumber(acctNum);

  return (
    <article className="vads-u-padding--0" data-testid="how-to-pay">
      <h2 id="how-to-pay">How to make a payment</h2>
      <h3>Pay online</h3>
      <p>
        Pay directly from your bank account or by debit or credit card on the
        secure pay.gov website.
      </p>
      <p>You’ll need the following details to pay this bill online:</p>
      {!isOverview && (
        <ul className="vads-u-padding-left--0">
          <li className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-bottom--2p5 vads-u-max-width--none">
            <span>Account number</span>
            <div className="account-parts-container">
              {accountParts.map((part, index) => (
                <div key={index} className="account-part-row">
                  <div className="vads-u-display--flex vads-u-flex-direction--column">
                    <span className="info-header">Part {index + 1}</span>
                    <strong>{part}</strong>
                  </div>
                  <CopyButton
                    value={part}
                    className="vads-u-flex-shrink--0"
                    aria-label={`Copy account part ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </li>
          {amtDue > 0 && (
            <li className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-bottom--1 vads-u-max-width--none">
              <span>Current balance</span>
              <strong>${amtDue}</strong>
            </li>
          )}
        </ul>
      )}
      <va-icon icon="navigate_next" class="icon-action" size="3" />
      <va-link
        aria-label="Opens pay.va.gov in a new tab"
        external
        text="Pay at pay.gov"
        href="https://www.pay.gov/public/form/start/25987221"
        class="vads-u-margin-top--2 vads-u-font-weight--bold"
      />

      <h3>Pay by phone</h3>
      <p>
        Call us at <va-telephone contact="8888274817" /> (
        <va-telephone tty contact={CONTACTS[711]} />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
      <h3>Pay in person</h3>
      <p>
        Visit{' '}
        {isOverview
          ? 'the facility'
          : lightHouseFacilityName || facility?.facilityName}{' '}
        and ask for the agent cashier’s office. Bring your payment stub, along
        with a check or money order made payable to "VA". Be sure to include
        your account number on the check or money order.
      </p>
      <h3>Pay by mail</h3>
      <p>
        <strong>Please send us these items:</strong>
      </p>
      <ul>
        <li>
          A check or money order (made payable to the "U.S. Department of
          Veterans Affairs"), <strong>and</strong>
        </li>
        <li>The payment remittance stub for your bill</li>
      </ul>
      <p>
        <strong>Print this information on each check or money order:</strong>
      </p>
      <ul>
        <li>Your full name</li>
        <li>Your account number</li>
      </ul>
      <p>
        <strong>Mail your payment and remittance stubs to:</strong>
      </p>
      <p className="va-address-block">
        Department of Veterans Affairs
        <br />
        PO Box 3978
        <br />
        Portland, OR 97208-3978
        <br />
      </p>
      <p>
        <strong>Note: </strong> You’ll find these stubs at the bottom of each
        statement. If you don’t have your most recent statement, you can
        download and print it or include a note listing the facility you’d like
        to pay.
      </p>
    </article>
  );
};

HowToPay.propTypes = {
  acctNum: PropTypes.string,
  amtDue: PropTypes.string,
  facility: PropTypes.shape({
    facilityName: PropTypes.string,
  }),
  isOverview: PropTypes.bool,
};

export default HowToPay;
