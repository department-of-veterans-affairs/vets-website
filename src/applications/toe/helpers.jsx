import { cloneDeep } from 'lodash';

import { isValidCurrentOrPastDate } from 'platform/forms-system/src/js/utilities/validations';
import {
  formFields,
  SPONSOR_NOT_LISTED_LABEL,
  SPONSOR_NOT_LISTED_VALUE,
  SPONSOR_RELATIONSHIP,
} from './constants';

import { getSchemaCountryCode } from './utils/form-submit-transform';

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

export const hideUnder18Field = (formData, fieldName) => {
  if (!formData || !formData[fieldName]) {
    return true;
  }

  const dateParts = formData && formData[fieldName].split('-');

  if (!dateParts || dateParts.length !== 3) {
    return true;
  }
  const birthday = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  const today18YearsAgo = new Date(
    new Date(new Date().setFullYear(new Date().getFullYear() - 18)).setHours(
      0,
      0,
      0,
      0,
    ),
  );

  return (
    !isValidCurrentOrPastDate(dateParts[2], dateParts[1], dateParts[0]) ||
    birthday.getTime() <= today18YearsAgo.getTime()
  );
};

export const addWhitespaceOnlyError = (field, errors, errorMessage) => {
  if (isOnlyWhitespace(field)) {
    errors.addError(errorMessage);
  }
};

export function prefillTransformer(pages, formData, metadata, state) {
  const bankInformation = state.data?.bankInformation || {};
  const claimant = state.data?.formData?.data?.attributes?.claimant || {};
  const contactInfo = claimant?.contactInfo || {};
  const sponsors = state.data?.formData?.attributes?.sponsors;
  // const vaProfile = stateUser?.vaProfile;

  const stateUser = state.user;
  const profile = stateUser?.profile;
  const vet360ContactInfo = stateUser.vet360ContactInformation;

  const userAddressLine1 =
    profile?.addressLine1 ||
    vet360ContactInfo?.addressLine1 ||
    contactInfo?.addressLine1;
  const userAddressLine2 =
    profile?.addressLine2 ||
    vet360ContactInfo?.addressLine2 ||
    contactInfo?.addressLine2;
  const userCity =
    profile?.city || vet360ContactInfo?.city || contactInfo?.city;
  const userState =
    profile?.stateCode ||
    vet360ContactInfo?.stateCode ||
    contactInfo?.stateCode;
  const userPostalCode =
    profile?.zipcode || vet360ContactInfo?.zipcode || contactInfo?.zipcode;
  const userCountryCode =
    profile?.countryCode ||
    vet360ContactInfo?.countryCode ||
    contactInfo?.countryCode;
  const emailAddress =
    profile?.email ||
    vet360ContactInfo?.email?.emailAddress ||
    contactInfo.emailAddress ||
    undefined;

  let mobilePhoneNumber;
  let mobilePhoneIsInternational;
  const v360mp = vet360ContactInfo?.mobilePhone;
  if (v360mp?.areaCode && v360mp?.phoneNumber) {
    mobilePhoneNumber = [v360mp.areaCode, v360mp.phoneNumber].join();
    mobilePhoneIsInternational = v360mp.isInternational;
  } else {
    mobilePhoneNumber = contactInfo?.mobilePhoneNumber;
  }

  let homePhoneNumber;
  let homePhoneIsInternational;
  const v360hp = vet360ContactInfo?.homePhone;
  if (v360hp?.areaCode && v360hp?.phoneNumber) {
    homePhoneNumber = [v360hp.areaCode, v360hp.phoneNumber].join();
    homePhoneIsInternational = v360hp.isInternational;
  } else {
    homePhoneNumber = contactInfo?.homePhoneNumber;
  }

  // profile?.userFullName?.first || claimant?.firstName || undefined,
  const newData = {
    ...formData,
    sponsors,
    formId: state.data?.formData?.data?.id,
    claimantId: claimant.claimantId,
    [formFields.viewUserFullName]: {
      [formFields.userFullName]: {
        first: profile?.userFullName?.first || claimant?.firstName || undefined,
        middle:
          profile?.userFullName?.middle || claimant?.middleName || undefined,
        last: profile?.userFullName?.last || claimant?.lastName || undefined,
      },
    },
    dateOfBirth: profile?.dob || claimant?.dateOfBirth,
    [formFields.email]: {
      email: emailAddress,
      confirmEmail: emailAddress,
    },
    [formFields.viewPhoneNumbers]: {
      [formFields.mobilePhoneNumber]: {
        phone: mobilePhoneNumber?.replace(/\D/g, '') || undefined,
        isInternational: mobilePhoneIsInternational,
      },
      [formFields.phoneNumber]: {
        phone: homePhoneNumber?.replace(/\D/g, '') || undefined,
        isInternational: homePhoneIsInternational,
      },
    },
    [formFields.bankAccount]: {
      ...bankInformation,
      accountType: bankInformation?.accountType?.toLowerCase(),
    },
    [formFields.viewMailingAddress]: {
      [formFields.address]: {
        street: userAddressLine1,
        street2: userAddressLine2,
        city: userCity,
        state: userState,
        postalCode: userPostalCode,
        country: getSchemaCountryCode(userCountryCode),
      },
      livesOnMilitaryBase:
        contactInfo?.countryCode !== 'US' &&
        contactInfo?.addressType === 'MILITARY_OVERSEAS',
    },
  };

  if (claimant?.suffix) {
    newData['view:userFullName'].userFullName.suffix = claimant?.suffix;
  }

  return {
    metadata,
    formData: newData,
    pages,
    state,
  };
}

export function mapSelectedSponsors(sponsors) {
  const selectedSponsors = sponsors.sponsors?.flatMap(
    sponsor => (sponsor.selected ? [sponsor.id] : []),
  );
  if (sponsors.someoneNotListed) {
    selectedSponsors.push(SPONSOR_NOT_LISTED_VALUE);
  }

  return selectedSponsors;
}

export function mapFormSponsors(formData, sponsors, fetchedSponsorsComplete) {
  return {
    ...formData,
    fetchedSponsorsComplete:
      fetchedSponsorsComplete || formData.fetchedSponsorsComplete,
    sponsors: {
      ...sponsors,
      loadedFromSavedState: true,
    },
    selectedSponsors: mapSelectedSponsors(sponsors),
    firstSponsor: sponsors.firstSponsor,
  };
}

export function updateSponsorsOnValueChange(
  sponsors,
  firstSponsor,
  value,
  checked,
) {
  const _sponsors = cloneDeep(sponsors);

  if (value === `sponsor-${SPONSOR_NOT_LISTED_VALUE}`) {
    _sponsors.someoneNotListed = checked;
  } else {
    const sponsorIndex = _sponsors.sponsors.findIndex(
      sponsor => `sponsor-${sponsor.id}` === value,
    );
    if (sponsorIndex > -1) {
      _sponsors.sponsors[sponsorIndex].selected = checked;
    }
  }

  _sponsors.selectedSponsors = mapSelectedSponsors(_sponsors);

  // Check to make sure that a previously-selected first sponsor hasn't
  // been removed from the list of selected sponsors.
  if (
    _sponsors.selectedSponsors.length <= 1 ||
    (!checked &&
      (value === `sponsor-${firstSponsor}` ||
        _sponsors.sponsors?.filter(s => s.selected)?.length < 2))
  ) {
    _sponsors.firstSponsor = null;
  }

  return _sponsors;
}

export function mapSponsorsToCheckboxOptions(sponsors) {
  const options =
    sponsors?.sponsors?.map((sponsor, index) => ({
      label: `Sponsor ${index + 1}: ${sponsor.name}`,
      selected: sponsor.selected,
      value: `sponsor-${sponsor.id}`,
    })) || [];
  options.push({
    label: SPONSOR_NOT_LISTED_LABEL,
    selected: sponsors?.someoneNotListed,
    value: `sponsor-${SPONSOR_NOT_LISTED_VALUE}`,
  });
  const anySelectedOptions = !!options?.filter(o => o.selected)?.length;
  const values = Object.fromEntries(
    new Map(options?.map(option => [option.value, !!option.selected])),
  );

  return {
    anySelectedOptions,
    options,
    values,
  };
}

export const applicantIsChildOfSponsor = formData => {
  const numSelectedSponsors = formData[formFields.selectedSponsors]?.length;

  if (
    !numSelectedSponsors ||
    (numSelectedSponsors === 1 && formData.sponsors?.someoneNotListed) ||
    (numSelectedSponsors > 1 &&
      formData.firstSponsor === SPONSOR_NOT_LISTED_VALUE)
  ) {
    return (
      formData[formFields.relationshipToServiceMember] ===
      SPONSOR_RELATIONSHIP.CHILD
    );
  }

  const sponsors = formData.sponsors?.sponsors;
  const sponsor =
    numSelectedSponsors === 1
      ? sponsors?.find(s => s.selected)
      : sponsors?.find(s => s.id === formData.firstSponsor);

  return sponsor?.relationship === SPONSOR_RELATIONSHIP.CHILD;
};
