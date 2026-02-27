import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { errorSchemaIsValid } from 'platform/forms-system/src/js/validation';
import { obfuscate, titleCase } from '../helpers';

export default function DirectDepositViewField({
  formData,
  formContext,
  errorSchema,
  startEditing,
  title,
}) {
  const bankAccount = formData?.bankAccount || {};
  const { accountType, accountNumber, routingNumber } = bankAccount;

  const accountTypeDisplay = accountType
    ? `${titleCase(accountType)} account`
    : 'Account';

  const editButton = [
    'edit-button',
    'vads-u-margin-top--4',
    'vads-u-width--auto',
  ].join(' ');

  // Ensure errors are re-validated when this component loads
  useEffect(
    () => {
      formContext.onError();
    },
    [formContext],
  );

  return (
    <>
      <p className="vads-u-margin-bottom--4">
        <strong>Note</strong>: Your bank account information is what we
        currently have on file for you. Please ensure it is correct.
      </p>
      <div className="va-address-block vads-u-margin-left--0">
        <h4>{`${accountTypeDisplay}`}</h4>
        <dl className="toe-definition-list">
          <dt className="toe-definition-list_term toe-definition-list_term--normal">
            Bank routing number:
          </dt>
          <dd className="toe-definition-list_definition">
            {obfuscate(routingNumber)}
          </dd>

          <dt className="toe-definition-list_term toe-definition-list_term--normal">
            Bank account number:
          </dt>
          <dd className="toe-definition-list_definition">
            {obfuscate(accountNumber)}
          </dd>
        </dl>
      </div>
      {!errorSchemaIsValid(errorSchema) && (
        <va-alert class="vads-u-margin-top--4" slim status="error">
          Banking information is missing or invalid. Please make sure it's
          correct.
        </va-alert>
      )}
      <button
        className={`usa-button-primary ${editButton}`}
        style={{ minWidth: '5rem', lineHeight: '1.5' }}
        onClick={() => {
          startEditing();
          formContext.onError();
        }}
        aria-label={`Edit ${title}`}
      >
        Edit
      </button>
    </>
  );
}

DirectDepositViewField.propTypes = {
  errorSchema: PropTypes.object.isRequired,
  formContext: PropTypes.shape({
    onError: PropTypes.func.isRequired,
  }).isRequired,
  formData: PropTypes.shape({
    bankAccount: PropTypes.shape({
      accountType: PropTypes.string,
      accountNumber: PropTypes.string,
      routingNumber: PropTypes.string,
    }),
  }).isRequired,
  startEditing: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
