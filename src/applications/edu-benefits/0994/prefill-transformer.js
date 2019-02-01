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
  const prefillBankInformation = data => {
    const {
      bankAccountType,
      bankAccountNumber,
      bankRoutingNumber,
      bankName,
    } = data;

    let hasBankInformation = false;

    if (bankAccountType && bankAccountNumber && bankRoutingNumber && bankName) {
      hasBankInformation = true;
    }

    return hasBankInformation;
  };

  const newFormData = {
    ...formData,
    'view:phoneAndEmail': phoneAndEmail,
    'view:bankAccount': {
      'view:hasBankInformation': prefillBankInformation,
    },
  };

  return {
    metadata,
    formData: newFormData,
    pages,
  };
}
