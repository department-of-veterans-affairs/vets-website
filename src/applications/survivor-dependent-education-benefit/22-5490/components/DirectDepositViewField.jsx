import React from 'react';
import PropTypes from 'prop-types';
import { obfuscate, obfuscateAriaLabel, titleCase } from '../helpers';

function DirectDepositViewField({ formData }) {
  const bankAccount = formData?.bankAccount || {};
  const { accountType, accountNumber, routingNumber } = bankAccount;

  const accountTypeDisplay = accountType
    ? `${titleCase(accountType)} account`
    : 'Account';

  return (
    <div
      className="survivor-benefit-direct-deposit"
      aria-labelledby="direct-deposit-info-heading"
      aria-describedby="direct-deposit-info-note"
    >
      <p id="direct-deposit-info-note" className="vads-u-margin-bottom--4">
        <strong>Note</strong>: Your bank account information is what we
        currently have on file for you. Please ensure it is correct.
      </p>
      <div className="va-address-block vads-u-margin-left--0">
        <h5 id="direct-deposit-info-heading">{accountTypeDisplay}</h5>
        <dl className="survivor-benefit-definition-list">
          <dt className="survivor-benefit-definition-list_term">
            Bank routing number:
          </dt>
          <dd
            aria-label={obfuscateAriaLabel(routingNumber)}
            className="survivor-benefit-definition-list_definition"
          >
            {obfuscate(routingNumber)}
          </dd>
          <dt className="survivor-benefit-definition-list_term">
            Bank account number:
          </dt>
          <dd
            aria-label={obfuscateAriaLabel(accountNumber)}
            className="survivor-benefit-definition-list_definition"
          >
            {obfuscate(accountNumber)}
          </dd>
        </dl>
      </div>
    </div>
  );
}

DirectDepositViewField.propTypes = {
  formData: PropTypes.shape({
    bankAccount: PropTypes.shape({
      accountType: PropTypes.string,
      accountNumber: PropTypes.string,
      routingNumber: PropTypes.string,
    }),
  }).isRequired,
};

export default DirectDepositViewField;
