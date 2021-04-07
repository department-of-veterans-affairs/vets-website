// import { hasPrefillBankInformation } from './utils';

export function prefillTransformer(pages, formData, metadata) {
  const {
    veteranFullName,
    veteranSocialSecurityNumber,
    homePhone,
    mobilePhone,
    email,
    veteranAddress,
    dateOfBirth,
  } = formData;

  // const hasBankInformation = hasPrefillBankInformation(formData.bankAccount);

  const newFormData = {
    'view:applicantInformation': {
      veteranFullName,
      veteranSocialSecurityNumber,
      dateOfBirth,
    },
    'view:contactInformation': {
      'view:phoneAndEmail': {
        mobilePhone,
        alternatePhone: homePhone,
        email,
      },
      address: veteranAddress,
    },
  };

  return {
    metadata,
    formData: newFormData,
    pages,
  };
}
