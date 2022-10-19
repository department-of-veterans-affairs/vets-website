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

function mapContactMethod(contactMethod) {
  if (contactMethod === 'mail') {
    return 'Mail';
  }
  if (contactMethod === 'email') {
    return 'Email';
  }
  return contactMethod;
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
  const bankInformation = state.data?.bankInformation || {};
  const claimant = state.data?.formData?.data?.attributes?.claimant || {};
  const serviceData = state.data?.formData?.data?.attributes?.serviceData || [];
  const contactInfo = claimant?.contactInfo || {};

  // Using test data for now.
  const stateUser = {};

  const vaProfile = stateUser?.vaProfile;
  const profile = stateUser?.profile;
  const vet360ContactInfo = stateUser.vet360ContactInformation;

  let firstName;
  let middleName;
  let lastName;
  let suffix;

  if (vaProfile?.familyName) {
    firstName = vaProfile?.givenNames[0];
    middleName = vaProfile?.givenNames[1];
    lastName = vaProfile?.familyName;
    // suffix = ???
  } else if (profile?.lastName) {
    firstName = profile?.firstName;
    middleName = profile?.middleName;
    lastName = profile?.lastName;
    // suffix = ???
  } else {
    firstName = claimant.firstName;
    middleName = claimant.middleName;
    lastName = claimant?.lastName;
    suffix = claimant.suffix;
  }

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

  const address = vet360ContactInfo?.mailingAddress?.addressLine1
    ? vet360ContactInfo?.mailingAddress
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
    [formFields.dateOfBirth]:
      formatHyphenlessDate(vaProfile?.birthDate) ||
      profile?.birthDate ||
      claimant?.dateOfBirth,
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
    [formFields.contactMethod]: mapContactMethod(claimant?.preferredContact),
    [formFields.viewMailingAddress]: {
      [formFields.address]: {
        street: address?.addressLine1,
        street2: address?.addressLine2 || undefined,
        city: address?.city,
        state: address?.stateCode,
        postalCode: address?.zipcode,
        country: getSchemaCountryCode(address?.countryCode),
      },
      [formFields.livesOnMilitaryBase]:
        address?.countryCode !== 'US' &&
        address?.addressType === 'MILITARY_OVERSEAS',
    },
    'view:bankAccount': {
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
