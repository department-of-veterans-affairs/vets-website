import { getSchemaCountryCode } from './utils/form-submit-transform';

export const SPONSOR_RELATIONSHIP = {
  CHILD: 'Child',
  SPOUSE: 'Spouse',
};
export const SPONSOR_NOT_LISTED_LABEL = 'Someone not listed here';
export const SPONSOR_NOT_LISTED_VALUE = 'SPONSOR_NOT_LISTED';

export function isOnlyWhitespace(str) {
  return str && !str.trim().length;
}

export function isAlphaNumeric(str) {
  const alphaNumericRegEx = new RegExp(/^[a-z0-9]+$/i);
  return alphaNumericRegEx.test(str);
}

export function titleCase(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export function obfuscate(str, numVisibleChars = 4, obfuscateChar = '●') {
  if (!str) {
    return '';
  }

  if (str.length <= numVisibleChars) {
    return str;
  }

  return (
    obfuscateChar.repeat(str.length - numVisibleChars) +
    str.substring(str.length - numVisibleChars, str.length)
  );
}

/**
 * Formats a date in human-readable form. For example:
 * January 1, 2000.
 *
 * @param {*} rawDate A date in the form '01-01-2000'
 * @returns A human-readable date string.
 */
export const formatReadableDate = rawDate => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  let dateParts;
  let date;

  if (rawDate) {
    dateParts = rawDate.split('-');
    date = new Date(
      Number.parseInt(dateParts[0], 10),
      Number.parseInt(dateParts[1], 10) - 1,
      Number.parseInt(dateParts[2], 10),
    );
  }

  if (!date) {
    return '';
  }

  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export const addWhitespaceOnlyError = (field, errors, errorMessage) => {
  if (isOnlyWhitespace(field)) {
    errors.addError(errorMessage);
  }
};

export const transformAlphaOnlyLowercase = str =>
  str.toLowerCase().replace(/[^a-z]/g, '');

export const equalsAlphaOnlyIgnoreCase = (a, b) => {
  return transformAlphaOnlyLowercase(a) === transformAlphaOnlyLowercase(b);
};

export function prefillTransformer(pages, formData, metadata, state) {
  const bankInformation = state.data?.bankInformation || {};
  const claimant = state.data?.formData?.data?.attributes?.claimant || {};
  const contactInfo = claimant?.contactInfo || {};
  const stateUser = state.user;
  const vapContactInfo = stateUser?.profile?.vapContactInfo || {};
  const profile = stateUser?.profile;

  const sponsors = state.data?.formData?.attributes?.toeSponsors;
  const serviceData = state.data?.formData?.attributes?.serviceData;

  let firstName;
  let middleName;
  let lastName;
  let suffix;
  if (profile?.userFullName?.first && profile?.userFullName?.last) {
    firstName = profile.userFullName.first;
    middleName = profile.userFullName.middle;
    lastName = profile.userFullName.last;
    // suffix = ???
  } else {
    firstName = claimant.firstName;
    middleName = claimant.middleName;
    lastName = claimant?.lastName;
    suffix = claimant.suffix;
  }

  const emailAddress =
    vapContactInfo.email?.emailAddress ||
    profile?.email ||
    contactInfo.emailAddress ||
    undefined;
  let mobilePhoneNumber;
  let mobilePhoneIsInternational;
  const vapMobilePhone = vapContactInfo.mobilePhone || {};
  if (vapMobilePhone.areaCode && vapMobilePhone.phoneNumber) {
    mobilePhoneNumber = [
      vapMobilePhone.areaCode,
      vapMobilePhone.phoneNumber,
    ].join();
    mobilePhoneIsInternational = vapMobilePhone.isInternational;
  } else {
    mobilePhoneNumber = contactInfo?.mobilePhoneNumber;
  }
  let homePhoneNumber;
  let homePhoneIsInternational;
  const vapHomePhone = vapContactInfo.homePhone || {};
  if (vapHomePhone.areaCode && vapHomePhone.phoneNumber) {
    homePhoneNumber = [vapHomePhone.areaCode, vapHomePhone.phoneNumber].join();
    homePhoneIsInternational = vapHomePhone.isInternational;
  } else {
    homePhoneNumber = contactInfo?.homePhoneNumber;
  }

  const address = vapContactInfo.mailingAddress?.addressLine1
    ? vapContactInfo.mailingAddress
    : contactInfo;

  const newData = {
    ...formData,
    sponsors,
    serviceData,
    formId: state.data?.formData?.data?.id,
    claimantId: claimant.claimantId,
    relationshipToMember: formData?.relationshipToMember,
    claimantFullName: {
      first: firstName,
      middle: middleName,
      last: lastName,
    },
    relativeSsn: formData?.relativeSocialSecurityNumber || formData?.ssn,
    highSchoolDiploma: formData?.highSchoolDiploma,
    graduationDate: formData?.graduationDate,
    claimantDateOfBirth: profile?.dob || claimant?.dateOfBirth,
    marriageStatus: formData?.marriageStatus,
    marriageDate: formData?.marriageDate,
    remarriageStatus: formData?.remarriageStatus,
    remarriageDate: formData?.remarriageDate,
    felonyOrWarrant: formData?.felonyOrWarrant,
    chosenBenefit: formData?.chosenBenefit,
    email: emailAddress,
    confirmEmail: emailAddress,
    mobilePhone: {
      phone: mobilePhoneNumber?.replace(/\D/g, ''),
      isInternational: mobilePhoneIsInternational,
    },
    homePhone: {
      phone: homePhoneNumber?.replace(/\D/g, ''),
      isInternational: homePhoneIsInternational,
    },
    mailingAddressInput: {
      address: {
        street: address?.addressLine1,
        street2: address?.addressLine2 || undefined,
        city: address?.city,
        state: address?.stateCode || address?.province,
        postalCode:
          address?.zipcode ||
          address?.postalCode ||
          address?.internationalPostalCode,
        country: getSchemaCountryCode(
          address?.countryCodeIso3 || address?.countryCode,
        ),
      },
      livesOnMilitaryBase: address?.addressType === 'MILITARY_OVERSEAS',
    },
    notificationMethod: claimant?.notificationMethod || formData?.contactMethod,
    declineDirectDeposit: formData?.declineDirectDeposit,
    'view:directDeposit': {
      bankAccount: {
        ...bankInformation,
        routingNumberConfirmation: bankInformation?.routingNumber,
        accountNumberConfirmation: bankInformation?.accountNumber,
      },
    },
  };

  if (suffix) {
    newData.fullName.suffix = suffix;
  }
  return {
    metadata,
    formData: newData,
    pages,
    state,
  };
}
