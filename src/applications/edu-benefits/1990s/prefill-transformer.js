import { prefillBankInformation } from 'platform/forms-system/src/js/definitions/directDeposit';
import _ from 'lodash';

const deviewifyFields = formData => {
  const newFormData = {};
  Object.keys(formData).forEach(key => {
    const nonViewKey = /^view:/.test(key) ? key.replace('view:', '') : key;
    // Recurse if necessary
    newFormData[nonViewKey] =
      typeof formData[key] === 'object' && !Array.isArray(formData[key])
        ? deviewifyFields(formData[key])
        : formData[key];
  });
  return newFormData;
};

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
  const originalBankAccount = {
    ...prefillBankInfo['view:originalBankAccount'],
    'view:accountType': prefillBankInfo['view:originalBankAccount'][
      'view:accountType'
    ]?.toLowerCase(),
    'view:bankName': undefined,
  };

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
    'view:originalBankAccount': originalBankAccount,
    'view:directDeposit': {
      bankAccount: {
        ...prefillBankInfo.bankAccount,
        ...deviewifyFields(_.omit(originalBankAccount, ['view:bankName'])),
      },
    },
  };

  return {
    metadata,
    formData: newFormData,
    pages,
  };
}
