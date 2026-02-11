import _ from 'lodash';
import { getPrefillIntlPhoneNumber } from '../helpers';

export default function prefillTransformer(pages, formData, metadata, state) {
  // Claimant data from MEB API (primary source)
  const claimant = state.data?.formData?.data?.attributes?.claimant || {};
  const claimantContactInfo = claimant?.contactInfo || {};

  // User profile data (fallback source)
  const {
    dob,
    email: profileEmail,
    ssn: profileSsn,
    userFullName,
    vapContactInfo,
  } = state.user.profile || {};

  const prefillContactInformation = data => {
    const { applicantFullName, email, ssn, mailingAddress, dateOfBirth } = data;

    // Name: prefer claimant data, fallback to profile
    let prefillName;
    if (claimant.firstName && claimant.lastName) {
      prefillName = {
        first: claimant.firstName,
        middle: claimant.middleName,
        last: claimant.lastName,
        suffix: claimant.suffix,
      };
    } else if (applicantFullName?.first || applicantFullName?.last) {
      prefillName = applicantFullName;
    } else if (userFullName?.first || userFullName?.last) {
      prefillName = userFullName;
    }

    // Email: prefer claimant, fallback to profile
    const emailAddress =
      email ||
      claimantContactInfo.emailAddress ||
      vapContactInfo?.email?.emailAddress ||
      profileEmail ||
      undefined;

    // Phone numbers: prefer claimant, fallback to vapContactInfo
    let mobilePhone;
    if (claimantContactInfo.mobilePhoneNumber) {
      mobilePhone = {
        callingCode: 1,
        countryCode: 'US',
        contact: claimantContactInfo.mobilePhoneNumber.replace(/\D/g, ''),
      };
    } else {
      mobilePhone = getPrefillIntlPhoneNumber(vapContactInfo?.mobilePhone);
    }

    let homePhone;
    if (claimantContactInfo.homePhoneNumber) {
      homePhone = {
        callingCode: 1,
        countryCode: 'US',
        contact: claimantContactInfo.homePhoneNumber.replace(/\D/g, ''),
      };
    } else {
      homePhone = getPrefillIntlPhoneNumber(vapContactInfo?.homePhone);
    }

    // Date of birth: prefer claimant, fallback to profile
    const prefillDob = dateOfBirth || claimant.dateOfBirth || dob;

    // Mailing address: prefer claimant, fallback to vapContactInfo
    let prefillMailingAddress = mailingAddress;
    if (
      claimantContactInfo.addressLine1 &&
      claimantContactInfo.city &&
      claimantContactInfo.countryCode
    ) {
      prefillMailingAddress = {
        street: claimantContactInfo.addressLine1,
        street2: claimantContactInfo.addressLine2 || undefined,
        city: claimantContactInfo.city,
        state: claimantContactInfo.stateCode,
        postalCode: claimantContactInfo.zipCode || claimantContactInfo.zipcode,
        country: claimantContactInfo.countryCode,
      };
    } else if (vapContactInfo?.mailingAddress?.addressLine1) {
      prefillMailingAddress = {
        street: vapContactInfo.mailingAddress.addressLine1,
        street2: vapContactInfo.mailingAddress.addressLine2 || undefined,
        city: vapContactInfo.mailingAddress.city,
        state: vapContactInfo.mailingAddress.stateCode,
        postalCode: vapContactInfo.mailingAddress.zipCode,
        country: vapContactInfo.mailingAddress.countryCodeIso3 || 'USA',
      };
    }

    const newData = _.omit(data, ['homePhone', 'mobilePhone', 'email', 'dob']);
    newData.contactInfo = {
      homePhone,
      mobilePhone,
      emailAddress,
    };
    newData.dateOfBirth = prefillDob;
    newData.applicantFullName = prefillName;
    newData.mailingAddress = prefillMailingAddress;
    newData.ssn = ssn || profileSsn;
    newData.claimantId = claimant.claimantId;
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
    return {
      ...data,
      bankAccount: {
        ...state.data?.bankInformation,
        accountNumber:
          data.bankAccount?.accountNumber ||
          state.data?.bankInformation?.accountNumber,
        accountNumberConfirmation:
          data.bankAccount?.accountNumber ||
          state.data?.bankInformation?.accountNumber,
        accountType:
          data.bankAccount?.accountType ||
          state.data?.bankInformation?.accountType,
        routingNumber:
          data.bankAccount?.routingNumber ||
          state.data?.bankInformation?.routingNumber,
        routingNumberConfirmation:
          data.bankAccount?.routingNumber ||
          state.data?.bankInformation?.routingNumber,
      },
    };
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
    state,
  };
}
