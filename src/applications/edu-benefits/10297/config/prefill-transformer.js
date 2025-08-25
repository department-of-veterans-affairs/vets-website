import _ from 'lodash';
import { viewifyFields } from '../helpers';

export default function prefillTransformer(pages, formData, metadata, state) {
  const prefillContactInformation = data => {
    const {
      applicantFullName,
      contactInfo: { homePhone, mobilePhone } = {},
      email,
      ssn,
      mailingAddress,
      dateOfBirth,
    } = data;
    const { dob, email: emailAddress, userFullName } = state.user.profile;

    const emailAddresses = email || emailAddress || undefined;

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

  const prefillBankInformation = data => {
    const newData = { ...data };

    const bankInfo = state.user.profile?.bankAccount || {};
    const { accountType, accountNumber, routingNumber } = {
      ...bankInfo,
      ...data,
    };

    newData.bankAccount = {
      accountType,
      accountNumber,
      routingNumber,
    };

    newData['view:originalBankAccount'] = viewifyFields({
      accountType: newData.bankAccount.accountType,
      accountNumber: newData.bankAccount.accountNumber,
      routingNumber: newData.bankAccount.routingNumber,
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
    formData: finalFormData,
    pages,
  };
}
