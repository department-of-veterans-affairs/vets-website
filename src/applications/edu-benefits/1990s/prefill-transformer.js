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
    'view:originalBankAccount': {
      ...prefillBankInfo['view:originalBankAccount'],
      'view:bankName': undefined,
      'view:accountType': prefillBankInfo['view:originalBankAccount'][
        'view:accountType'
      ]?.toLowerCase(),
    },
    'view:directDeposit': {
      bankAccount: {
        ...prefillBankInfo.bankAccount,
      },
    },
  };

  return {
    metadata,
    formData: newFormData,
    pages,
  };
}
