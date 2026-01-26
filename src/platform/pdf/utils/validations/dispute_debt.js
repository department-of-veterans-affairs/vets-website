import { MissingFieldsException } from '../exceptions/MissingFieldsException';

export const validate = data => {
  const missingFields = [];

  // Validate top-level data fields
  const requiredFieldsData = ['selectedDebts', 'submissionDetails', 'veteran'];
  const missingDataFields = requiredFieldsData.filter(field => !data[field]);
  missingFields.push(...missingDataFields.map(field => `data.${field}`));

  // Early return if critical fields are missing
  if (missingDataFields.length > 0) {
    throw new MissingFieldsException(missingFields);
  }

  const { selectedDebts, submissionDetails, veteran } = data;

  // Validate submissionDetails
  const requiredFieldsSubmissionDetails = ['submissionDateTime'];
  const missingSubmissionFields = requiredFieldsSubmissionDetails.filter(
    field => !submissionDetails[field],
  );
  missingFields.push(
    ...missingSubmissionFields.map(field => `submissionDetails.${field}`),
  );

  // Validate veteran fields
  const requiredFieldsVeteran = [
    'dob',
    'veteranFullName',
    'ssnLastFour',
    'mailingAddress',
    'email',
    'mobilePhone',
  ];
  const missingVeteranFields = requiredFieldsVeteran.filter(
    field => !veteran[field],
  );
  missingFields.push(...missingVeteranFields.map(field => `veteran.${field}`));

  // Only validate nested objects if parent objects exist
  if (veteran.mailingAddress) {
    const requiredFieldsMailingAddress = [
      'addressLine1',
      'city',
      'countryName',
      'zipCode',
      'stateCode',
    ];
    const missingAddressFields = requiredFieldsMailingAddress.filter(
      field => !veteran.mailingAddress[field],
    );
    missingFields.push(
      ...missingAddressFields.map(field => `veteran.mailingAddress.${field}`),
    );
  }

  if (veteran.mobilePhone) {
    const requiredFieldsMobilePhone = [
      'phoneNumber',
      'countryCode',
      'areaCode',
    ];
    const missingPhoneFields = requiredFieldsMobilePhone.filter(
      field => !veteran.mobilePhone[field],
    );
    missingFields.push(
      ...missingPhoneFields.map(field => `veteran.mobilePhone.${field}`),
    );
  }

  if (veteran.veteranFullName) {
    const requiredFieldsVeteranFullName = ['first', 'last'];
    const missingNameFields = requiredFieldsVeteranFullName.filter(
      field => !veteran.veteranFullName[field],
    );
    missingFields.push(
      ...missingNameFields.map(field => `veteran.veteranFullName.${field}`),
    );
  }

  // Validate selectedDebts
  if (!Array.isArray(selectedDebts) || selectedDebts.length === 0) {
    missingFields.push('selectedDebts (must be a non-empty array)');
  } else {
    selectedDebts.forEach((debt, index) => {
      const requiredFieldsDebt = ['label', 'disputeReason', 'supportStatement'];
      const missingDebtFields = requiredFieldsDebt.filter(
        field => !debt[field],
      );
      missingFields.push(
        ...missingDebtFields.map(field => `selectedDebts[${index}].${field}`),
      );
    });
  }

  if (missingFields.length > 0) {
    throw new MissingFieldsException(missingFields);
  }
};
