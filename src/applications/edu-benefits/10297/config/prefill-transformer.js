import _ from 'lodash';

export function prefillTransformer(pages, formData, metadata, state) {
  const { homePhone, email } = formData; // Destructure bankAccount from formData
  const { edipi, icn, dob, email: emailAddress, gender } = state.user.profile;

  const emailAddresses = email || emailAddress || undefined;
  console.log(state.user.profile, 'state.user.profile in prefillTransformer');

  const newFormData = {
    ..._.omit(formData, [
      'homePhone',
      'email',
      'dob',
      'edipi',
      'icn',
      'bankAccount', // Ensure bankAccount is omitted before potentially adding it back
    ]),
    contactInfo: {
      homePhone,
      emailAddress: emailAddresses,
      'view:confirmEmail': emailAddresses,
    },
    edipi,
    icn,
    dateOfBirth: dob,
    applicantGender: gender,
  };

  return {
    metadata,
    formData: newFormData, // newFormData now contains the prefilled bankAccount if applicable
    pages,
    state,
  };
}
