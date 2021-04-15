import { prefillBankInformation } from 'platform/forms-system/src/js/definitions/directDeposit';
import _ from 'lodash';
import { deviewifyFields } from './utils';

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
    'view:bankName': undefined, // need this so that prefill display messages will show correctly, remove if bankName is added
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
