import React from 'react';
import PropTypes from 'prop-types';
import { reviewEntry } from 'platform/forms-system/src/js/components/ConfirmationView/ChapterSectionCollection';
import { paymentRows } from '../PaymentViewObjectField';

const ConfirmationPaymentInformation = ({ formData }) => {
  const hasPrefilledBankInfo = Boolean(
    formData?.['view:bankAccount']?.['view:hasPrefilledBank'],
  );
  const hasNewBankingInfo = Boolean(
    formData?.['view:bankAccount']?.bankAccountType ||
      formData?.['view:bankAccount']?.bankAccountNumber ||
      formData?.['view:bankAccount']?.bankRoutingNumber ||
      formData?.['view:bankAccount']?.bankName,
  );

  // Return null if no prefilled bank information and no new banking information (it is optional)
  if (!hasNewBankingInfo && !hasPrefilledBankInfo) {
    return null;
  }

  const newBankingInformation = formData?.['view:bankAccount'];
  const prefilledBankingInformation = formData?.['view:originalBankAccount'];

  // Use new banking info if it exists
  if (hasNewBankingInfo) {
    const newBankingInfoEntries = {
      bankAccountType: {
        label: paymentRows.bankAccountType,
        data: newBankingInformation.bankAccountType || '',
      },
      bankName: {
        label: paymentRows.bankName,
        data: newBankingInformation.bankName || '',
      },
      bankAccountNumber: {
        label: paymentRows.bankAccountNumber,
        data: newBankingInformation.bankAccountNumber
          ? `******${newBankingInformation.bankAccountNumber.slice(-4)}`
          : '',
      },
      bankRoutingNumber: {
        label: paymentRows.bankRoutingNumber,
        data: newBankingInformation.bankRoutingNumber
          ? `*****${newBankingInformation.bankRoutingNumber.slice(-4)}`
          : '',
      },
    };

    return (
      <li>
        <h4>Payment Information</h4>
        <ul className="vads-u-padding--0" style={{ listStyle: 'none' }}>
          {Object.entries(newBankingInfoEntries).map(([key, value]) =>
            reviewEntry(null, key, null, value.label, value.data),
          )}
        </ul>
      </li>
    );
  }

  if (hasPrefilledBankInfo && !hasNewBankingInfo) {
    const prefilledBankingInfoEntries = {
      bankAccountType: {
        label: paymentRows.bankAccountType,
        data: prefilledBankingInformation?.['view:bankAccountType'] || '',
      },
      bankName: {
        label: paymentRows.bankName,
        data: prefilledBankingInformation?.['view:bankName'] || '',
      },
      bankAccountNumber: {
        label: paymentRows.bankAccountNumber,
        data: prefilledBankingInformation?.['view:bankAccountNumber']
          ? `******${prefilledBankingInformation[
              'view:bankAccountNumber'
            ].slice(-4)}`
          : '',
      },
      bankRoutingNumber: {
        label: paymentRows.bankRoutingNumber,
        data: prefilledBankingInformation?.['view:bankRoutingNumber']
          ? `*****${prefilledBankingInformation['view:bankRoutingNumber'].slice(
              -4,
            )}`
          : '',
      },
    };
    return (
      <li>
        <h4>Payment Information</h4>
        <ul className="vads-u-padding--0" style={{ listStyle: 'none' }}>
          {Object.entries(prefilledBankingInfoEntries).map(([key, value]) =>
            reviewEntry(null, key, null, value.label, value.data),
          )}
        </ul>
      </li>
    );
  }

  // Default return if no conditions are met
  return null;
};

ConfirmationPaymentInformation.propTypes = {
  formData: PropTypes.object,
};

export default ConfirmationPaymentInformation;
