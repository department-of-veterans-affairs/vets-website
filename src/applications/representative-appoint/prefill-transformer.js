import { prefillBankInformation } from 'platform/forms-system/src/js/definitions/directDeposit';
import _ from 'lodash';
import { deviewifyFields } from './utilities/helpers';

export function prefillTransformer(pages, formData, metadata) {
  const {
    veteranFullName,
    veteranSsnLastFour,
    veteranVaFileNumberLastFour,
    homePhone,
    mobilePhone,
    email,
    address,
    dateOfBirth,
    bankAccount,
  } = formData;

  let newFormData = {
    'view:applicantInformation': {
      veteranFullName,
      veteranSsnLastFour,
      dateOfBirth,
      veteranVaFileNumberLastFour,
    },
    'view:contactInformation': {
      'view:phoneAndEmail': {
        mobilePhone,
        alternatePhone: homePhone,
        email,
      },
      address,
    },
  };

  if (bankAccount) {
    const prefillBankInfo = prefillBankInformation({
      ...bankAccount,
      bankName: bankAccount?.bankName || 'fakeBank', // so that the check in the function doesn't fail if no bankName, omitted down below
    });
    const prefillBankAccount = _.get(
      prefillBankInfo,
      'view:originalBankAccount',
      {},
    );
    const originalBankAccount = {
      ...prefillBankAccount,
      'view:accountType': prefillBankAccount['view:accountType']?.toLowerCase(),
      'view:bankName': undefined, // need this so that prefill display messages will show correctly, remove if bankName is added
    };

    newFormData = {
      ...newFormData,
      'view:originalBankAccount': originalBankAccount,
      'view:directDeposit': {
        bankAccount: {
          ...prefillBankInfo.bankAccount,
          ...deviewifyFields(_.omit(originalBankAccount, ['view:bankName'])),
        },
      },
    };
  }

  return {
    metadata,
    formData: newFormData,
    pages,
  };
}
