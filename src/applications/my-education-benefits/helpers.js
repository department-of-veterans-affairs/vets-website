import React from 'react';
import moment from 'moment';
import { DATE_TIMESTAMP, formFields } from './constants';
import { getSchemaCountryCode } from './utils/form-submit-transform';

export const directDepositWarning = (
  <div className="pension-dd-warning">
    The Department of Treasury requires all federal benefit payments be made by
    electronic funds transfer (EFT), also called direct deposit. If you don’t
    have a bank account, you must get your payment through Direct Express Debit
    MasterCard. To request a Direct Express Debit MasterCard you must apply at{' '}
    <a
      href="http://www.usdirectexpress.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      www.usdirectexpress.com
    </a>{' '}
    or by telephone at <va-telephone contact="8003331795" />. If you chose not
    to enroll, you must contact representatives handling waiver requests for the
    Department of Treasury at <va-telephone contact="8882242950" />. They will
    address any questions or concerns you may have and encourage your
    participation in EFT.
  </div>
);

export const unsureDescription = (
  <>
    <strong>Note:</strong> After you submit this applicaton, a VA representative
    will reach out to help via your preferred contact method.
  </>
);

export const post911GiBillNote = (
  <div className="usa-alert background-color-only">
    <h3>You’re applying for the Post-9/11 GI Bill®</h3>
    <p>
      At this time, you can only apply for the Post-9/11 GI Bill (Chapter 33)
      benefits through this application. Doing so will require that you give up
      one other benefit you may be eligible for. You cannot change your decision
      after you submit this application.
    </p>
  </div>
);

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
 * Converts a number to a string, preserving a minimum number of integer
 * digits.
 * Examples:
 * (5, 0) => '5'
 * (5, 1) => '5'
 * (5, 2) => '05'
 * (5, 3) => '005'
 * (2022, 2) => '2022'
 * (2022, 5) => '02022'
 * (3.14159, 1) => '3.14159'
 * (3.14159, 2) => '03.14159'
 * (3.14159, 3) => '003.14159'
 * @param {number} n The number we want to convert.
 * @param {number} minDigits The minimum number of integer digits to preserve.
 * @returns {string} The number formatted as a string.
 */
export const convertNumberToStringWithMinimumDigits = (n, minDigits) => {
  return n.toLocaleString('en-US', {
    minimumIntegerDigits: minDigits,
    useGrouping: false,
  });
};

/**
 * Formats a date in human-readable form. For example:
 * January 1, 2000.
 *
 * @param {*} rawDate A date in the form '01-01-2000'
 * @returns A human-readable date string.
 */
export const formatReadableDate = (rawDate, minimumDateDigits = 1) => {
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

  const dateParts = rawDate?.split('-');
  let date;

  if (rawDate && dateParts.length >= 3) {
    date = new Date(
      Number.parseInt(dateParts[0], 10),
      Number.parseInt(dateParts[1], 10) - 1,
      Number.parseInt(dateParts[2], 10),
    );
  }

  if (!date) {
    return '';
  }

  return `${months[date.getMonth()]} ${convertNumberToStringWithMinimumDigits(
    date.getDate(),
    minimumDateDigits,
  )}, ${date.getFullYear()}`;
};

/**
 * This function recieves the uiSchema and formData objects and returns
 * a comma separated list of the selected checkboxes in a checkbox
 * group.  The formData object contains the name of the checkbox
 * elements in the group as the keys with a boolean value as the proerty
 * (true if checked, false if unchecked). Here is an example:
 *
 * ```
 * {
 *   canEmailNotify: true,
 *   canTextNotify: false
 * }
 * ```
 *
 * The following function splits the formData object into a 2D array
 * where each array item has two properties: the key and the form value
 * (a boolean).  So, our example above would end up being:
 *
 * ```
 * [
 *   ['canEmailNotify', true],
 *   ['canTextNotify', false]
 * ]
 * ```
 *
 * It then filters the formData object, selecting only the checkboxes
 * that are checked.  Then, it retrieves the titles of the selected keys
 * from the uiSchema and joins them with a comma.
 *
 * Also, Object.entries splits the formData data object into
 *
 * @param {*} uiSchema UI Schema object
 * @param {*} formData Form Data object.
 * @returns Comma separated list of selected checkbox titles.
 */
export const getSelectedCheckboxes = (uiSchema, formData) =>
  Object.entries(formData)
    .filter(checkboxOption => checkboxOption[1]) // true/false
    .map(checkboxOption => checkboxOption[0]) // object key
    .map(selectedCheckboxKey => uiSchema[selectedCheckboxKey]['ui:title'])
    .join(', ');

function transformServiceHistory(serviceHistory) {
  return {
    dateRange: {
      from: moment(serviceHistory?.beginDate).format(DATE_TIMESTAMP),
      to: moment(serviceHistory?.endDate).format(DATE_TIMESTAMP),
    },
    exclusionPeriods: serviceHistory?.exclusionPeriods?.map(exclusionPeriod => {
      return {
        from: moment(exclusionPeriod.beginDate).format(DATE_TIMESTAMP),
        to: moment(exclusionPeriod.endDate).format(DATE_TIMESTAMP),
      };
    }),
    trainingPeriods: serviceHistory?.trainingPeriods?.map(exclusionPeriod => {
      return {
        from: moment(exclusionPeriod.beginDate).format(DATE_TIMESTAMP),
        to: moment(exclusionPeriod.endDate).format(DATE_TIMESTAMP),
      };
    }),
    serviceBranch: serviceHistory?.branchOfService,
    serviceCharacter: serviceHistory?.characterOfService,
    separationReason: serviceHistory?.reasonForSeparation,
  };
}
function mapNotificationMethodV2({ notificationMethod }) {
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

/**
 * Transforms a date in the format YYYYMMDD (e.g. '17760704')
 * to YYYY-MM-DD (e.g. '1776-07-04').
 * @param {string} b Date without a string.
 * @returns Date formatted with hyphens.
 */
export const formatHyphenlessDate = b => {
  if (!b || b.length < 8) {
    return undefined;
  }

  return `${b.slice(0, 4)}-${b.slice(4, 6)}-${b.slice(6, 8)}`;
};

export function prefillTransformerV1(pages, formData, metadata, state) {
  const bankInformation = state.data?.bankInformation || {};
  const claimant = state.data?.formData?.data?.attributes?.claimant || {};
  const serviceData = state.data?.formData?.data?.attributes?.serviceData || [];
  const contactInfo = claimant?.contactInfo || {};
  const stateUser = state.user || {};

  const profile = stateUser?.profile;
  const vapContactInfo = stateUser.profile?.vapContactInfo || {};

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
    [formFields.formId]: state.data?.formData?.data?.id,
    [formFields.claimantId]: claimant?.claimantId,
    [formFields.viewUserFullName]: {
      [formFields.userFullName]: {
        first: firstName || undefined,
        middle: middleName || undefined,
        last: lastName || undefined,
      },
    },
    [formFields.dateOfBirth]: profile?.birthDate || claimant?.dateOfBirth,
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
    [formFields.viewReceiveTextMessages]: {
      [formFields.receiveTextMessages]: mapNotificationMethodV2(claimant),
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
      [formFields.livesOnMilitaryBase]:
        address?.addressType === 'MILITARY_OVERSEAS',
    },
    [formFields.bankAccount]: {
      ...bankInformation,
      accountType: bankInformation?.accountType?.toLowerCase(),
    },
    [formFields.toursOfDuty]: serviceData.map(transformServiceHistory),
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
  const serviceData = state.data?.formData?.data?.attributes?.serviceData || [];
  const contactInfo = claimant?.contactInfo || {};
  const stateUser = state.user || {};

  const profile = stateUser?.profile;
  const vapContactInfo = stateUser.profile?.vapContactInfo || {};

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
    [formFields.formId]: state.data?.formData?.data?.id,
    [formFields.claimantId]: claimant?.claimantId,
    [formFields.viewUserFullName]: {
      [formFields.userFullName]: {
        first: firstName || undefined,
        middle: middleName || undefined,
        last: lastName || undefined,
      },
    },
    [formFields.dateOfBirth]: profile?.birthDate || claimant?.dateOfBirth,
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
    [formFields.viewReceiveTextMessages]: {
      [formFields.receiveTextMessages]: mapNotificationMethodV2(claimant),
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
      [formFields.livesOnMilitaryBase]:
        address?.addressType === 'MILITARY_OVERSEAS',
    },
    [formFields.bankAccount]: {
      ...bankInformation,
      accountType: bankInformation?.accountType?.toLowerCase(),
    },
    [formFields.toursOfDuty]: serviceData.map(transformServiceHistory),
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

export function prefillTransformerV3(pages, formData, metadata, state) {
  const bankInformation = state.data?.bankInformation || {};
  const claimant = state.data?.formData?.data?.attributes?.claimant || {};
  const exclusionPeriods = Array.isArray(state.data?.exclusionPeriods)
    ? state.data?.exclusionPeriods
    : [];
  const serviceData = state.data?.formData?.data?.attributes?.serviceData || [];
  const contactInfo = claimant?.contactInfo || {};
  const stateUser = state.user || {};

  const profile = stateUser?.profile;
  const vapContactInfo = stateUser.profile?.vapContactInfo || {};

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
    [formFields.formId]: state.data?.formData?.data?.id,
    [formFields.claimantId]: claimant?.claimantId,
    [formFields.viewUserFullName]: {
      [formFields.userFullName]: {
        first: firstName || undefined,
        middle: middleName || undefined,
        last: lastName || undefined,
      },
    },
    [formFields.dateOfBirth]: profile?.birthDate || claimant?.dateOfBirth,
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
    [formFields.viewReceiveTextMessages]: {
      [formFields.receiveTextMessages]: mapNotificationMethodV2(claimant),
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
      [formFields.livesOnMilitaryBase]:
        address?.addressType === 'MILITARY_OVERSEAS',
    },
    [formFields.federallySponsoredAcademy]: exclusionPeriods?.includes(
      'Academy',
    )
      ? 'Yes'
      : 'No',
    [formFields.seniorRotcCommission]: exclusionPeriods?.includes('ROTC')
      ? 'Yes'
      : 'No',
    [formFields.loanPayment]: exclusionPeriods?.includes('LRP') ? 'Yes' : 'No',
    [formFields.bankAccount]: {
      ...bankInformation,
      accountType: bankInformation?.accountType?.toLowerCase(),
    },
    [formFields.toursOfDuty]: serviceData.map(transformServiceHistory),
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

export function prefillTransformerV4(pages, formData, metadata, state) {
  const bankInformation = state.data?.bankInformation || {};
  const claimant = state.data?.formData?.data?.attributes?.claimant || {};
  const serviceData = state.data?.formData?.data?.attributes?.serviceData || [];
  const contactInfo = claimant?.contactInfo || {};
  const stateUser = state.user || {};

  const profile = stateUser?.profile;
  const vapContactInfo = stateUser.profile?.vapContactInfo || {};

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
    [formFields.formId]: state.data?.formData?.data?.id,
    [formFields.claimantId]: claimant?.claimantId,
    [formFields.viewUserFullName]: {
      [formFields.userFullName]: {
        first: firstName || undefined,
        middle: middleName || undefined,
        last: lastName || undefined,
      },
    },
    [formFields.dateOfBirth]: profile?.birthDate || claimant?.dateOfBirth,
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
    [formFields.viewReceiveTextMessages]: {
      [formFields.receiveTextMessages]: mapNotificationMethodV2(claimant),
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
      [formFields.livesOnMilitaryBase]:
        address?.addressType === 'MILITARY_OVERSEAS',
    },
    [formFields.viewDirectDeposit]: {
      [formFields.bankAccount]: {
        ...bankInformation,
        accountType: bankInformation?.accountType?.toLowerCase(),
      },
    },
    [formFields.toursOfDuty]: serviceData.map(transformServiceHistory),
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
  const mebExclusionPeriodEnabled =
    state.featureToggles?.mebExclusionPeriodEnabled;
  const showDgiDirectDeposit1990EZ =
    state.featureToggles?.show_dgi_direct_deposit_1990EZ;

  // Return an empty object if feature toggles haven't loaded yet
  if (!featureTogglesLoaded) {
    return {};
  }
  if (showDgiDirectDeposit1990EZ) {
    return prefillTransformerV4(pages, formData, metadata, state);
  }

  if (showInternationalAddressPrefill) {
    return prefillTransformerV2(pages, formData, metadata, state);
  }
  // Use prefillTransformerV3 if mebExclusionPeriodEnabled feature flag is on
  if (mebExclusionPeriodEnabled) {
    return prefillTransformerV3(pages, formData, metadata, state);
  }
  // Default to prefillTransformerV1 if none of the above conditions are met
  return prefillTransformerV1(pages, formData, metadata, state);
}

export function customDirectDepositDescription() {
  return (
    <div>
      <p>
        VA makes payments through only direct deposit, also called electronic
        funds transfer (EFT).
      </p>
    </div>
  );
}
