import React from 'react';
import { obfuscate, titleCase } from '../helpers';

export default function DirectDepositViewField({ formData }) {
  const bankAccount = formData?.bankAccount || {};
  const {
    accountType,
    accountNumber,
    // financialInstitutionName,
    routingNumber,
  } = bankAccount;

  return (
    <>
      <p className="vads-u-margin-bottom--4">
        <strong>Note</strong>: We make payments only through direct deposit,
        also called electronic funds transfer (EFT).
      </p>
      <div className="va-address-block vads-u-margin-left--0">
        <h5>{`${titleCase(accountType)} account`}</h5>
        <dl className="meb-definition-list">
          {/* <dt>Bank name:</dt>
          <dd>{financialInstitutionName}</dd> */}

          <dt className="meb-definition-list_term toe-definition-list_term--normal">
            Account Number:
          </dt>
          <dd className="meb-definition-list_definition">
            {obfuscate(accountNumber)}
          </dd>

          <dt className="meb-definition-list_term toe-definition-list_term--normal">
            Routing Number:
          </dt>
          <dd className="meb-definition-list_definition">
            {obfuscate(routingNumber)}
          </dd>
        </dl>
      </div>
    </>
  );
}
