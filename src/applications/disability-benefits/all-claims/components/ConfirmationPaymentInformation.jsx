import React from 'react';
import PropTypes from 'prop-types';
import { reviewEntry } from 'platform/forms-system/src/js/components/ConfirmationView/ChapterSectionCollection';

const ConfirmationPaymentInformation = ({ formData }) => {
  const bankingInformation = formData?.['view:bankAccount'];

  // Return null if bankingInformation is undefined, null, or an empty object
  if (!bankingInformation || Object.keys(bankingInformation).length === 0) {
    return null;
  }

  const bankingEntries = {
    bankAccountType: {
      label: 'Account type',
      data: bankingInformation.bankAccountType || '',
    },
    bankName: {
      label: 'Bank name',
      data: bankingInformation.bankName || '',
    },
    bankAccountNumber: {
      label: 'Account number',
      data: bankingInformation.bankAccountNumber
        ? `******${bankingInformation.bankAccountNumber.slice(-4)}`
        : '',
    },
    bankRoutingNumber: {
      label: 'Routing number',
      data: bankingInformation.bankRoutingNumber
        ? `*****${bankingInformation.bankRoutingNumber.slice(-4)}`
        : '',
    },
  };

  // export const reviewEntry = (description, key, uiSchema, label, data) => {
  return (
    <li>
      <h4>Payment Information</h4>
      <ul className="vads-u-padding--0" style={{ listStyle: 'none' }}>
        {Object.entries(bankingEntries).map(([key, value]) =>
          reviewEntry(null, key, null, value.label, value.data),
        )}
      </ul>
    </li>
  );
};

ConfirmationPaymentInformation.propTypes = {
  formData: PropTypes.object,
};
export default ConfirmationPaymentInformation;
