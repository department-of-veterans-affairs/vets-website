const buildVeteranInformation = vetContactInfo => {
  const {
    countryCodeIso3: countryName,
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    stateCode,
    zipCode,
  } = vetContactInfo.residentialAddress;

  return {
    veteranAddress: {
      countryName,
      addressLine1,
      addressLine2,
      addressLine3,
      city,
      stateCode,
      zipCode,
    },
    phoneNumber: `${vetContactInfo.homePhone.areaCode}${
      vetContactInfo.homePhone.phoneNumber
    }`,
    emailAddress: vetContactInfo.email.emailAddress,
  };
};

// maps to values in the 686 task wizard schema
// https://github.com/department-of-veterans-affairs/vets-json-schema/blob/master/src/schemas/686c-674/schema.js#L126
const WIZARD_OPTIONS_KEYS = {
  DIVORCE: 'reportDivorce',
  ANNULMENT: 'reportDivorce',
  VOID: 'reportDivorce',
  DEATH: 'reportDeath',
};

// maps to values in the 686 report divorce reason
// https://github.com/department-of-veterans-affairs/vets-json-schema/blob/master/src/schemas/686c-674/schema.js#L507
const DIVORCE_REASONS = {
  DIVORCE: 'Divorce',
  ANNULMENT: 'Other',
  VOID: 'Other',
};

// mirror the date format forms submit with
const formatDateString = date => {
  const dateFragments = date.split('/');
  return `${dateFragments[2]}-${dateFragments[0]}-${dateFragments[1]}`;
};

const transformForSubmit = formData => {
  const payload = {};
  const {
    fullName: { firstName: first, lastName: last },
    date,
    dateOfBirth,
    ssn,
    location,
  } = formData;
  // this goes in all iterations of the payload.
  const universalData = {
    fullName: {
      first,
      last,
    },
    date,
  };
  // if formdata includes reasonMarriageEnded, user is reporting either a divorce or the death of a spouse.
  if (formData.reasonMarriageEnded) {
    payload['view:selectable686Options'] = {
      [WIZARD_OPTIONS_KEYS[formData.reasonMarriageEnded]]: true,
    };
    if (payload['view:selectable686Options'].reportDivorce) {
      payload.reportDivorce = {
        ...universalData,
        reasonMarriageEnded: DIVORCE_REASONS[formData.reasonMarriageEnded],
        location,
        ssn,
        birthDate: formatDateString(dateOfBirth),
      };
    }
  }

  return payload;
};

export const submitToApi = (formData, vetContactInfo, userInfo) => {
  const mergedFormData = { ...formData, ...userInfo };
  return {
    veteranContactInformation: buildVeteranInformation(vetContactInfo),
    ...transformForSubmit(mergedFormData),
  };
};
