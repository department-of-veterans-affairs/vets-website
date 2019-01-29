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

  const newFormData = {
    ...formData,
    'view:phoneAndEmail': phoneAndEmail,
  };

  return {
    metadata,
    formData: newFormData,
    pages,
  };
}
