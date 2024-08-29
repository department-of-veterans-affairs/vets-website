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

function mapNotificationMethod({ notificationMethod }) {
  if (notificationMethod === 'EMAIL') {
    return 'No, just send me email notifications';
  }
  if (notificationMethod === 'TEXT') {
    return 'Yes, send me text message notifications';
  }

  return notificationMethod;
}

export const transformAlphaOnlyLowercase = str =>
  str.toLowerCase().replace(/[^a-z]/g, '');

export const equalsAlphaOnlyIgnoreCase = (a, b) => {
  return transformAlphaOnlyLowercase(a) === transformAlphaOnlyLowercase(b);
};

export function prefillTransformerV1(pages, formData, metadata, state) {
  const bankInformation = state.data?.bankInformation || {};
  const claimant = state.data?.formData?.data?.attributes?.claimant || {};
  const contactInfo = claimant?.contactInfo || {};
  const sponsors = state.data?.formData?.attributes?.sponsors;
  const stateUser = state.user;
  const vapContactInfo = stateUser.profile?.vapContactInfo || {};
  const profile = stateUser?.profile;

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
    formId: state.data?.formData?.data?.id,
    claimantId: claimant.claimantId,
    [formFields.viewUserFullName]: {
      [formFields.userFullName]: {
        first: firstName || undefined,
        middle: middleName || undefined,
        last: lastName || undefined,
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
        street: address?.addressLine1,
        street2: address?.addressLine2 || undefined,
        city: address?.city,
        state: address?.stateCode,
        postalCode: address?.zipCode || address?.zipcode,
        country: getSchemaCountryCode(address?.countryCode),
      },
      livesOnMilitaryBase:
        contactInfo?.countryCode !== 'US' &&
        contactInfo?.addressType === 'MILITARY_OVERSEAS',
    },
    [formFields.viewReceiveTextMessages]: {
      [formFields.receiveTextMessages]: mapNotificationMethod(claimant),
    },
  };

  if (suffix) {
    newData[formFields.viewUserFullName].userFullName.suffix =
      state?.form?.pages?.applicantInformation?.schema?.properties[
        formFields.viewUserFullName
      ]?.properties?.userFullName?.properties?.suffix?.enum?.find(e =>
        equalsAlphaOnlyIgnoreCase(e, suffix),
      ) || undefined;
  }

  return {
    metadata,
    formData: newData,
    pages,
    state,
  };
}

export function prefillTransformerV2(pages, formData, metadata, state) {
  const bankInformation = state.data?.bankInformation || {};
  const claimant = state.data?.formData?.data?.attributes?.claimant || {};
  const contactInfo = claimant?.contactInfo || {};
  const sponsors = state.data?.formData?.attributes?.sponsors;
  const stateUser = state.user;
  const vapContactInfo = stateUser.profile?.vapContactInfo || {};
  const profile = stateUser?.profile;

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
    formId: state.data?.formData?.data?.id,
    claimantId: claimant.claimantId,
    [formFields.viewUserFullName]: {
      [formFields.userFullName]: {
        first: firstName || undefined,
        middle: middleName || undefined,
        last: lastName || undefined,
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
      // accountType: bankInformation?.accountType?.toLowerCase(),
    },
    [formFields.viewMailingAddress]: {
      [formFields.address]: {
        street: address?.addressLine1,
        street2: address?.addressLine2 || undefined,
        city: address?.city,
        state: address?.stateCode || address?.province,
        postalCode:
          address?.zipCode ||
          address?.zipcode ||
          address?.internationalPostalCode,
        country: getSchemaCountryCode(
          address?.countryCodeIso3 || address?.countryCode,
        ),
      },
      livesOnMilitaryBase:
        contactInfo?.countryCode !== 'US' &&
        contactInfo?.addressType === 'MILITARY_OVERSEAS',
    },
    [formFields.viewReceiveTextMessages]: {
      [formFields.receiveTextMessages]: mapNotificationMethod(claimant),
    },
  };

  if (suffix) {
    newData[formFields.viewUserFullName].userFullName.suffix =
      state?.form?.pages?.applicantInformation?.schema?.properties[
        formFields.viewUserFullName
      ]?.properties?.userFullName?.properties?.suffix?.enum?.find(e =>
        equalsAlphaOnlyIgnoreCase(e, suffix),
      ) || undefined;
  }

  return {
    metadata,
    formData: newData,
    pages,
    state,
  };
}

export function prefillTransformer(pages, formData, metadata, state) {
  const featureTogglesLoaded = state.featureToggles?.loading === false;
  const showInternationalAddressPrefill =
    state.featureToggles?.showMebInternationalAddressPrefill;

  if (!featureTogglesLoaded) {
    return {};
  }

  if (showInternationalAddressPrefill) {
    return prefillTransformerV2(pages, formData, metadata, state);
  }

  return prefillTransformerV1(pages, formData, metadata, state);
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

export function mapSponsorsToCheckboxOptions(sponsors, showMebEnhancements08) {
  const options =
    sponsors?.sponsors?.map((sponsor, index) => ({
      label: `Sponsor ${index + 1}: ${sponsor.name}`,
      selected: sponsor.selected,
      value: `sponsor-${sponsor.id}`,
    })) || [];
  if (!showMebEnhancements08 && sponsors?.someoneNotListed) {
    options.push({
      label: SPONSOR_NOT_LISTED_LABEL,
      selected: sponsors?.someoneNotListed,
      value: `sponsor-${SPONSOR_NOT_LISTED_VALUE}`,
    });
  }
  const anySelectedOptions = !!options?.filter(o => o.selected)?.length;
  return {
    anySelectedOptions,
    options,
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

export const applicantIsaMinor = formData => {
  if (!formData || !formData?.dob) {
    return true;
  }
  const dateParts = formData && formData?.dob.split('-');

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

  return birthday.getTime() >= today18YearsAgo.getTime();
};
