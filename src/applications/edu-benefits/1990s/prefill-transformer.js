import { prefillBankInformation } from 'platform/forms-system/src/js/definitions/directDeposit';

export function prefillTransformer(pages, formData, metadata) {
  const {
    veteranFullName,
    veteranSocialSecurityNumber,
    homePhone,
    mobilePhone,
    email,
    address,
    dateOfBirth,
    bankAccount,
  } = formData;

  const prefillBankInfo = prefillBankInformation(bankAccount);
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
      address,
    },
    'view:directDeposit': prefillBankInfo,
  };

  return {
    metadata,
    formData: newFormData,
    pages,
  };
}
