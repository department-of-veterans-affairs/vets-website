import React from 'react';
import PropTypes from 'prop-types';
import { reviewEntry } from 'platform/forms-system/src/js/components/ConfirmationView/ChapterSectionCollection';
import { paymentRows } from './PaymentViewObjectField';

const ConfirmationPaymentInformation = ({ formData }) => {
  const bankingInformation = formData?.['view:bankAccount'];

  // Return null if bankingInformation is undefined, null, or an empty object
  if (!bankingInformation || Object.keys(bankingInformation).length === 0) {
    return null;
  }

  const bankingEntries = {
    bankAccountType: {
      label: paymentRows.bankAccountType,
      data: bankingInformation.bankAccountType || '',
    },
    bankName: {
      label: paymentRows.bankName,
      data: bankingInformation.bankName || '',
    },
    bankAccountNumber: {
      label: paymentRows.bankAccountNumber,
      data: bankingInformation.bankAccountNumber
        ? `******${bankingInformation.bankAccountNumber.slice(-4)}`
        : '',
    },
    bankRoutingNumber: {
      label: paymentRows.bankRoutingNumber,
      data: bankingInformation.bankRoutingNumber
        ? `*****${bankingInformation.bankRoutingNumber.slice(-4)}`
        : '',
    },
  };

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
