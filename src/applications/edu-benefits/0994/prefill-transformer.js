import _ from 'lodash';
import { hasPrefillBankInformation } from './utils';

export function prefillTransformer(pages, formData, metadata) {
  // TODO: enable this to implement the review card UI for verified users
  // TODO: add 'state' to arguments

  // const { verified } = state.user.profile;

  // const newFormData = _.set('view:isVerified', !!verified, formData);

  const phoneAndEmail = {
    homePhone: formData.homePhone,
    mobilePhone: formData.mobilePhone,
    emailAddress: formData.emailAddress,
  };

  const newData = _.omit(formData, ['bankAccount']);

  const hasBankInformation = hasPrefillBankInformation(formData.bankAccount);

  const newFormData = {
    ...newData,
    'view:phoneAndEmail': phoneAndEmail,
    prefillBankAccount: formData.bankAccount,
    'view:bankAccount': {
      'view:hasBankInformation': hasBankInformation,
    },
  };

  return {
    metadata,
    formData: newFormData,
    pages,
  };
}
