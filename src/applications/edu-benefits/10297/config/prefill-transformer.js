import _ from 'lodash';
import { viewifyFields } from '../helpers';

const prefillBankInformation = data => {
  const newData = _.omit(
    ['accountType', 'accountNumber', 'routingNumber'],
    data,
  );

  const { accountType, accountNumber, routingNumber } = data;

  if (accountType && accountNumber && routingNumber) {
    newData['view:originalBankAccount'] = viewifyFields({
      accountType,
      accountNumber,
      routingNumber,
    });

    // start the bank widget in 'review' mode
    newData['view:bankAccount'] = { 'view:hasPrefilledBank': true };
  }
  // console.log('newDataaaaaaaa', newData);
  return newData;
};

export function prefillTransformer(pages, formData, metadata, state) {
  const { homePhone, email } = formData; // Destructure bankAccount from formData
  const { edipi, icn, dob, email: emailAddress, gender } = state.user.profile;

  const emailAddresses = email || emailAddress || undefined;
  // console.log(state.user.profile, 'state.user.profile in prefillTransformer');

  const newFormData = {
    ..._.omit(formData, [
      'homePhone',
      'email',
      'dob',
      'edipi',
      'icn',
      'bankAccount', // Ensure bankAccount is omitted before potentially adding it back
    ]),
    bankAccount: prefillBankInformation(formData), // Add the prefilled bankAccount


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
  console.log('newFormData in prefillTransformer', newFormData);

  return {
    metadata,
    formData: newFormData, // newFormData now contains the prefilled bankAccount if applicable
    pages,
    state,
  };
}
