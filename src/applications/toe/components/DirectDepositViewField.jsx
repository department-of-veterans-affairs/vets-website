import React from 'react';
import { obfuscate, obfuscateAriaLabel, titleCase } from '../helpers';

export default function DirectDepositViewField({ formData }) {
  const bankAccount = formData?.bankAccount || {};
  const { accountType, accountNumber, routingNumber } = bankAccount;

  return (
    <>
      <p className="vads-u-margin-bottom--4">
        <strong>Note</strong>: Your bank account information is what we
        currently have on file for you. Please ensure it is correct.
      </p>
      <div className="va-address-block vads-u-margin-left--0">
        <h5>{`${titleCase(accountType)} account`}</h5>
        <dl className="toe-definition-list">
          <dt className="toe-definition-list_term toe-definition-list_term--normal">
            Bank routing number:
          </dt>
          <dd className="toe-definition-list_definition">
            <span aria-hidden="true">{obfuscate(routingNumber)}</span>
            <span className="sr-only">{obfuscateAriaLabel(routingNumber)}</span>
          </dd>

          <dt className="toe-definition-list_term toe-definition-list_term--normal">
            Bank account number:
          </dt>
          <dd className="toe-definition-list_definition">
            <span aria-hidden="true">{obfuscate(accountNumber)}</span>
            <span className="sr-only">{obfuscateAriaLabel(accountNumber)}</span>
          </dd>
        </dl>
      </div>
    </>
  );
}
