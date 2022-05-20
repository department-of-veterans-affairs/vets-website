import React from 'react';
import moment from 'moment';
import { DATE_TIMESTAMP } from './constants';
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

export const chapter30Label = (
  <>
    Montgomery GI Bill Active Duty (Chapter 30)
    <va-additional-info trigger="Learn more">
      <p className="vads-u-margin-top--0">
        Our records indicate you may be eligible for this benefit because you
        served at least two years on active duty and were honorably discharged.
        If you give up this benefit, VA will pay you for any eligible kickers
        associated with it.
      </p>
      <a
        href="https://www.va.gov/education/about-gi-bill-benefits/montgomery-active-duty/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more about the Montgomery GI Bill Active Duty
      </a>
    </va-additional-info>
  </>
);

export const chapter1606Label = (
  <>
    Montgomery GI Bill Selected Reserve (Chapter 1606)
    <va-additional-info trigger="Learn more">
      <p className="vads-u-margin-top--0">
        Our records indicate you may be eligible for this benefit because you
        agreed to serve six years in the Selected Reserve. If you give up this
        benefit, VA will pay you for any eligible kickers associated with it.
      </p>
      <a
        href="https://www.va.gov/education/about-gi-bill-benefits/montgomery-selected-reserve/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more about the Montgomery GI Bill Selected Reserve
      </a>
    </va-additional-info>
  </>
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

function mapNotificaitonMethod(notificationMethod) {
  if (notificationMethod === 'mail') {
    return 'Mail';
  }
  if (notificationMethod === 'email') {
    return 'Email';
  }
  return notificationMethod;
}

export const transformAlphaOnlyLowercase = str =>
  str.toLowerCase().replace(/[^a-z]/g, '');

export const equalsAlphaOnlyIgnoreCase = (a, b) => {
  return transformAlphaOnlyLowercase(a) === transformAlphaOnlyLowercase(b);
};

export function prefillTransformer(pages, formData, metadata, state) {
  const claimant = state.data?.formData?.data?.attributes?.claimant || {};
  const serviceData = state.data?.formData?.data?.attributes?.serviceData || [];
  const contactInfo = claimant?.contactInfo || {};

  const newData = {
    ...formData,
    formId: state.data?.formData?.data?.id,
    claimantId: claimant.claimantId,
    'view:userFullName': {
      userFullName: {
        first: claimant.firstName || undefined,
        middle: claimant.middleName || undefined,
        last: claimant.lastName || undefined,
      },
    },
    dateOfBirth: claimant.dateOfBirth,
    email: {
      email: contactInfo.emailAddress,
      confirmEmail: contactInfo.emailAddress,
    },
    'view:phoneNumbers': {
      mobilePhoneNumber: {
        phone: contactInfo?.mobilePhoneNumber?.replace(/\D/g, '') || undefined,
      },
      phoneNumber: {
        phone: contactInfo?.homePhoneNumber?.replace(/\D/g, '') || undefined,
      },
    },
    'view:contactMethod': {
      contactMethod: mapNotificaitonMethod(claimant?.notificationMethod),
    },
    'view:mailingAddress': {
      address: {
        street: contactInfo?.addressLine1,
        street2: contactInfo?.addressLine2 || undefined,
        city: contactInfo?.city,
        state: contactInfo?.stateCode,
        postalCode: contactInfo?.zipcode,
        country: getSchemaCountryCode(contactInfo?.countryCode),
      },
      livesOnMilitaryBase:
        contactInfo?.countryCode !== 'US' &&
        contactInfo?.addressType === 'MILITARY_OVERSEAS',
    },
    toursOfDuty: serviceData.map(transformServiceHistory),
  };

  if (claimant?.suffix) {
    newData['view:userFullName'].userFullName.suffix =
      state?.form?.pages?.applicantInformation?.schema?.properties[
        'view:userFullName'
      ]?.properties?.userFullName?.properties?.suffix?.enum?.find(e =>
        equalsAlphaOnlyIgnoreCase(e, claimant.suffix),
      ) || undefined;
  }

  return {
    metadata,
    formData: newData,
    pages,
    state,
  };
}
