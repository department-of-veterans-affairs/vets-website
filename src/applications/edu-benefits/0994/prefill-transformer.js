import _ from 'lodash';

export function prefillTransformer(pages, formData, metadata) {
  // TODO: enable this to implement the review card UI for verified users
  // TODO: add 'state' to arguments

  // const { verified } = state.user.profile;

  // const newFormData = _.set('view:isVerified', !!verified, formData);

  const phoneAndEmail = {
    dayTimePhone: formData.dayTimePhone,
    nightTimePhone: formData.nightTimePhone,
    emailAddress: formData.emailAddress,
  };

  const newData = _.omit(formData, ['bankAccount']);

  const { bankAccountType, bankAccountNumber, bankRoutingNumber } = _.get(
    formData,
    'bankAccount',
    {},
  );

  let hasBankInformation = false;

  if (bankAccountType && bankAccountNumber && bankRoutingNumber) {
    hasBankInformation = true;
  }

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
