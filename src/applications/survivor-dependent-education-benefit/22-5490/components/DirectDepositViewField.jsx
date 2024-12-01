import React from 'react';
import PropTypes from 'prop-types';
import { obfuscate, titleCase } from '../helpers';

export default function DirectDepositViewField({ formData }) {
  const bankAccount = formData?.bankAccount || {};
  const {
    accountType,
    accountNumber,
    // financialInstitutionName,
    routingNumber,
  } = bankAccount;

  const accountTypeDisplay = accountType
    ? `${titleCase(accountType)} account`
    : 'Account';

  return (
    <>
      <p className="vads-u-margin-bottom--4">
        <strong>Note</strong>: Your bank account information is what we
        currently have on file for you. Please ensure it is correct.
      </p>
      <div className="va-address-block vads-u-margin-left--0">
        <h5>{`${accountTypeDisplay}`}</h5>
        <dl className="meb-definition-list">
          {/* <dt>Bank name:</dt>
          <dd>{financialInstitutionName}</dd> */}

          <dt className="meb-definition-list_term toe-definition-list_term--normal">
            Bank routing number:
          </dt>
          <dd className="meb-definition-list_definition">
            {obfuscate(routingNumber)}
          </dd>

          <dt className="meb-definition-list_term toe-definition-list_term--normal">
            Bank account number:
          </dt>
          <dd className="meb-definition-list_definition">
            {obfuscate(accountNumber)}
          </dd>
        </dl>
      </div>
    </>
  );
}

DirectDepositViewField.propTypes = {
  // formData is expected to be an object
  formData: PropTypes.shape({
    bankAccount: PropTypes.shape({
      accountType: PropTypes.string,
      accountNumber: PropTypes.string,
      routingNumber: PropTypes.string,
    }),
  }).isRequired,
};
