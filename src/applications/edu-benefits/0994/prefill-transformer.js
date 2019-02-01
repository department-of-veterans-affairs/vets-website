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

  // Determine if bank information page should start in edit mode
  const {
    bankAccountType,
    bankAccountNumber,
    bankRoutingNumber,
    bankName,
  } = formData;

  let hasBankInformation = false;

  if (bankAccountType && bankAccountNumber && bankRoutingNumber && bankName) {
    hasBankInformation = true;
  }

  const newFormData = {
    ...formData,
    'view:phoneAndEmail': phoneAndEmail,
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
