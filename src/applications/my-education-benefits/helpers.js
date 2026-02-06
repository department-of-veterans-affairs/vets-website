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

export function prefillTransformer(pages, formData, metadata, state) {
  const featureTogglesLoaded = state?.featureToggles?.loading === false;
  if (!featureTogglesLoaded) {
    return { metadata, formData, pages, state };
  }

  try {
    const bankInformation = state?.data?.bankInformation || {};
    const claimant = state?.data?.formData?.data?.attributes?.claimant || {};
    const serviceData =
      state?.data?.formData?.data?.attributes?.serviceData || [];
    const contactInfo = claimant?.contactInfo || {};
    const stateUser = state?.user || {};
    const profile = stateUser?.profile || {};
    const vapContactInfo = profile?.vapContactInfo || {};
    const firstName = claimant?.firstName || profile?.userFullName?.first;
    const middleName = claimant?.middleName || profile?.userFullName?.middle;
    const lastName = claimant?.lastName || profile?.userFullName?.last;
    const suffix = claimant?.suffix;
    const emailAddress =
      vapContactInfo.email?.emailAddress ||
      profile?.email ||
      contactInfo?.emailAddress;

    const mobilePhoneNumber = contactInfo?.mobilePhoneNumber;
    const mobilePhoneIsInternational =
      contactInfo?.mobilePhone?.isInternational;
    const homePhoneNumber = contactInfo?.homePhoneNumber;
    const homePhoneIsInternational = contactInfo?.homePhone?.isInternational;

    // Choose address source
    const hasVapLine1 = vapContactInfo.mailingAddress?.addressLine1?.trim();
    const chosenAddress = hasVapLine1
      ? vapContactInfo.mailingAddress
      : contactInfo;

    // Build the new formData using formFields constants
    const newData = {
      ...formData,

      [formFields.formId]: state?.data?.formData?.data?.id,
      [formFields.claimantId]:
        claimant?.claimantId === 0 ? 100 : claimant?.claimantId,

      // Full name object
      [formFields.viewUserFullName]: {
        [formFields.userFullName]: {
          first: firstName,
          middle: middleName,
          last: lastName,
        },
      },

      [formFields.dateOfBirth]: profile?.dob || claimant?.dateOfBirth,

      [formFields.email]: {
        email: emailAddress,
        confirmEmail: emailAddress,
      },

      [formFields.viewPhoneNumbers]: {
        [formFields.mobilePhoneNumber]: {
          phone: mobilePhoneNumber?.replace(/\D/g, ''),
          isInternational: mobilePhoneIsInternational,
        },
        [formFields.phoneNumber]: {
          phone: homePhoneNumber?.replace(/\D/g, ''),
          isInternational: homePhoneIsInternational,
        },
      },

      [formFields.viewReceiveTextMessages]: {
        [formFields.receiveTextMessages]: mapNotificationMethodV2(claimant),
      },

      [formFields.viewDirectDeposit]: {
        [formFields.bankAccount]: {
          ...bankInformation,
          accountType: bankInformation?.accountType?.toLowerCase(),
        },
      },

      [formFields.toursOfDuty]: serviceData.map(transformServiceHistory),
    };
    // Remove any old mailing address to avoid leftover merges
    delete newData[formFields.viewMailingAddress];

    newData[formFields.viewMailingAddress] = {
      [formFields.address]: {
        street: chosenAddress?.addressLine1?.trim() || '',
        street2: chosenAddress?.addressLine2?.trim() || '',
        city: chosenAddress?.city?.trim() || '',
        state: chosenAddress?.stateCode || chosenAddress?.province || '',
        postalCode:
          chosenAddress?.zipCode ||
          chosenAddress?.zipcode ||
          chosenAddress?.internationalPostalCode ||
          '',
        country: getSchemaCountryCode(
          chosenAddress?.countryCodeIso3 || chosenAddress?.countryCode,
        ),
      },
      [formFields.livesOnMilitaryBase]: (() => {
        // Check if explicitly marked as military overseas
        if (chosenAddress?.addressType === 'MILITARY_OVERSEAS') {
          return true;
        }

        // Check if address has military postal codes or state codes
        const city = chosenAddress?.city?.trim()?.toUpperCase();
        const stateCode = chosenAddress?.stateCode?.trim()?.toUpperCase();
        const militaryCities = ['APO', 'FPO', 'DPO'];
        const militaryStates = ['AE', 'AA', 'AP'];

        const hasMilitaryCity = militaryCities.includes(city);
        const hasMilitaryState = militaryStates.includes(stateCode);

        return hasMilitaryCity || hasMilitaryState;
      })(),
    };
    const { eligibleForActiveDutyKicker, eligibleForReserveKicker } = claimant;
    newData[formFields.activeDutyKicker] = eligibleForActiveDutyKicker
      ? 'Yes'
      : undefined;
    newData[formFields.selectedReserveKicker] = eligibleForReserveKicker
      ? 'Yes'
      : undefined;

    if (suffix) {
      const possibleSuffixes =
        state?.form?.pages?.applicantInformation?.schema?.properties?.[
          formFields.viewUserFullName
        ]?.properties?.userFullName?.properties?.suffix?.enum || [];
      const matchedSuffix = possibleSuffixes.find(e =>
        equalsAlphaOnlyIgnoreCase(e, suffix),
      );
      newData[formFields.viewUserFullName][formFields.userFullName].suffix =
        matchedSuffix || undefined;
    }
    return { metadata, formData: newData, pages, state };
  } catch (error) {
    return { metadata, formData, pages, state };
  }
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

// utils/caseConverter.js
export const toSnakeCase = obj => {
  const result = {};
  Object.keys(obj).forEach(key => {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    result[snakeKey] = obj[key];
  });
  return result;
};

// Define all the form pages to help ensure uniqueness across all form chapters
export const formPages = {
  benefitSelection: 'benefitSelection',
  applicantInformation: 'applicantInformation',
  contactInformation: {
    contactInformation: 'contactInformation',
    mailingAddress: 'mailingAddress',
    mailingAddressMilitaryBaseUpdates: 'mailingAddressMilitaryBaseUpdates',
    preferredContactMethod: 'preferredContactMethod',
    newPreferredContactMethod: 'newPreferredContactMethod',
  },
  serviceHistory: 'serviceHistory',
  additionalConsiderations: {
    activeDutyKicker: {
      name: 'active-duty-kicker',
      order: 1,
      title:
        'Do you qualify for an active duty kicker, sometimes called a College Fund?',
      additionalInfo: {
        trigger: 'What is an active duty kicker?',
        info:
          'Kickers, sometimes referred to as College Funds, are additional amounts of money that increase an individual’s basic monthly benefit. Each Department of Defense service branch (and not VA) determines who receives the kicker payments and the amount received. Kickers are included in monthly GI Bill payments from VA.',
      },
    },
    reserveKicker: {
      name: 'reserve-kicker',
      order: 2,
      title:
        'Do you qualify for a reserve kicker, sometimes called a College Fund?',
      additionalInfo: {
        trigger: 'What is a reserve kicker?',
        info:
          'Kickers, sometimes referred to as College Funds, are additional amounts of money that increase an individual’s basic monthly benefit. Each Department of Defense service branch (and not VA) determines who receives the kicker payments and the amount received. Kickers are included in monthly GI Bill payments from VA.',
      },
    },
    sixHundredDollarBuyUp: {
      name: 'six-hundred-dollar-buy-up',
      order: 3,
      title:
        'Did you make additional contributions (up to $600) to increase the amount of your monthly benefits?',
    },
  },
  directDeposit: 'directDeposit',
};
