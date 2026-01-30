import _ from 'lodash';
import { getPrefillIntlPhoneNumber, viewifyFields } from '../helpers';
// Need to use claimant info stuff here
export default function prefillTransformer(pages, formData, metadata, state) {
  const prefillContactInformation = data => {
    const { applicantFullName, email, ssn, mailingAddress, dateOfBirth } = data;
    const {
      dob,
      email: emailAddress,
      userFullName,
      vapContactInfo,
    } = state.user.profile;

    const emailAddresses = email || emailAddress || undefined;
    const mobilePhone = getPrefillIntlPhoneNumber(vapContactInfo?.mobilePhone);
    const homePhone = getPrefillIntlPhoneNumber(vapContactInfo?.homePhone);

    const newData = _.omit(data, ['homePhone', 'mobilePhone', 'email', 'dob']);
    newData.contactInfo = {
      homePhone,
      mobilePhone,
      emailAddress: emailAddresses,
    };
    newData.dateOfBirth = dateOfBirth || dob;
    newData.applicantFullName = applicantFullName || userFullName;
    newData.mailingAddress = mailingAddress;
    newData.ssn = ssn;
    return newData;
  };

  /**
   * Use this function in the prefillTransformer to move all bank account
   * information into `view:originalBankAccount`. This is useful when using the
   * PaymentView component, which will display either `bankAccount` or
   * `view:originalBankAccount`.
   *
   * @param {object} data - All the pre-filled form data
   * @returns {object} - A new pre-filled form data object after transformation.
   */
  const prefillBankInformation = data => {
    const newData = { ...data };

    const bankInfo = state.data?.bankAccountInfo?.bankAccount || {};
    const accountType =
      data?.bankAccount?.bankAccountType || bankInfo.accountType;
    const accountNumber =
      data?.bankAccount?.bankAccountNumber || bankInfo.accountNumber;
    const routingNumber =
      data?.bankAccount?.bankRoutingNumber || bankInfo.routingNumber;
    newData.bankAccount = {
      accountType: accountType?.toLowerCase(),
      accountNumber,
      routingNumber,
    };

    newData['view:originalBankAccount'] = viewifyFields({
      accountType: accountType?.toLowerCase(),
      accountNumber,
      routingNumber,
    });

    newData['view:bankAccount'] = { 'view:hasPrefilledBank': true };
    return newData;
  };

  const transformations = [prefillContactInformation, prefillBankInformation];

  const applyTransformations = (data = {}, transformer) => {
    return transformer(data);
  };

  const finalFormData = transformations.reduce(applyTransformations, formData);

  return {
    metadata,
    formData: {
      ...finalFormData,
    },
    pages,
  };
}
