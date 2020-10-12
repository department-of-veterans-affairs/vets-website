import React from 'react';
import _ from 'lodash/fp';
import moment from 'moment';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import vaMedicalFacilities from 'vets-json-schema/dist/vaMedicalFacilities.json';

import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import {
  stringifyFormReplacer,
  filterViewFields,
  filterInactivePageData,
  getActivePages,
  expandArrayPages,
  createFormPageList,
} from 'platform/forms-system/src/js/helpers';
import { getInactivePages } from 'platform/forms/helpers';
import { isValidDate } from 'platform/forms/validations';
import { isInMPI } from 'platform/user/selectors';

import facilityLocator from '../facility-locator/manifest.json';

export function prefillTransformer(pages, formData, metadata, state) {
  let newData = formData;

  if (isInMPI(state)) {
    newData = { ...newData, 'view:isUserInMvi': true };
  }

  return {
    metadata,
    formData: newData,
    pages,
  };
}

export function transformAttachments(data) {
  if (!data.attachments || !(data.attachments instanceof Array)) {
    return data;
  }
  const transformedAttachments = data.attachments.map(attachment => {
    const { name, size, confirmationCode, attachmentId } = attachment;
    return {
      name,
      size,
      confirmationCode,
      dd214: attachmentId === '1',
    };
  });
  return { ...data, attachments: transformedAttachments };
}

export function transform(formConfig, form) {
  const expandedPages = expandArrayPages(
    createFormPageList(formConfig),
    form.data,
  );
  const activePages = getActivePages(expandedPages, form.data);
  const inactivePages = getInactivePages(expandedPages, form.data);
  const withoutInactivePages = filterInactivePageData(
    inactivePages,
    activePages,
    form,
  );
  let withoutViewFields = filterViewFields(withoutInactivePages);

  // add back dependents here, because it could have been removed in filterViewFields
  if (!withoutViewFields.dependents) {
    withoutViewFields = _.set('dependents', [], withoutViewFields);
  }

  // convert `attachmentId` values to a `dd214` boolean
  if (withoutViewFields.attachments) {
    withoutViewFields = transformAttachments(withoutViewFields);
  }

  const formData =
    JSON.stringify(withoutViewFields, (key, value) => {
      // Don’t let dependents be removed in the normal empty object clean up
      if (key === 'dependents') {
        return value;
      }

      return stringifyFormReplacer(key, value);
    }) || '{}';

  let gaClientId;
  try {
    // eslint-disable-next-line no-undef
    gaClientId = ga.getAll()[0].get('clientId');
  } catch (e) {
    // don't want to break submitting because of a weird GA issue
  }

  return JSON.stringify({
    gaClientId,
    asyncCompatible: true,
    form: formData,
  });
}

export const facilityHelp = (
  <div>
    <div>
      OR{' '}
      <a
        href={facilityLocator.rootUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Find locations with the VA Facility Locator
      </a>
    </div>
    <br />
    If you’re looking for medical care outside the continental U.S. or Guam,
    you’ll need to sign up for our Foreign Medical Program.{' '}
    <a
      href="https://www.va.gov/COMMUNITYCARE/programs/veterans/fmp/index.asp"
      rel="noopener noreferrer"
      target="_blank"
    >
      Learn more about the Foreign Medical Program
    </a>
    .<br />
    <p>
      You can also visit{' '}
      <a
        href="https://www.benefits.va.gov/PERSONA/veteran-abroad.asp"
        rel="noopener noreferrer"
        target="_blank"
      >
        Veterans Living Abroad
      </a>
      .
    </p>
  </div>
);

export function fileHelp({ formContext }) {
  if (formContext.reviewMode) {
    return null;
  }

  return (
    <>
      <p>
        Please upload a copy of your military discharge papers (like your DD214,
        DD256, DD257, NGB22, or other separation documents). If you have more
        than one discharge document, please upload the one with the highest
        character of discharge. If you don’t have your discharge papers, you can
        upload a copy of other official military documents (like proof of
        military awards or your disability rating letter).
      </p>
      <br />
      <p>
        You don’t have to upload these documents. But it can help us verify your
        military service and may speed up your application process.
      </p>
      <br />
      <p>
        <strong>Tips for uploading:</strong>
      </p>
      <ul>
        <li>
          Upload documents as one of these file types: .jpg, .png, .pdf, .doc,
          .rtf
        </li>
        <li>
          Upload one or more files that add up to no more than 10 MB total.
        </li>
        <li>
          If you don’t have a digital copy of a document, you can scan or take a
          photo of it and then upload the image from your computer or phone.
        </li>
      </ul>
    </>
  );
}

// Turns the facility list for each state into an array of strings
export const medicalCentersByState = _.mapValues(
  val => val.map(center => center.value),
  vaMedicalFacilities,
);

// Merges all the state facilities into one object with values as keys
// and labels as values
export const medicalCenterLabels = Object.keys(vaMedicalFacilities).reduce(
  (labels, state) => {
    const stateLabels = vaMedicalFacilities[state].reduce(
      (centers, center) =>
        Object.assign(centers, {
          [center.value]: center.label,
        }),
      {},
    );

    return Object.assign(labels, stateLabels);
  },
  {},
);

/**
 *
 * @param {string} facilityId - facility id in the form: `123 - ABCD` where the
 * id to look up is the first part of the string
 * @returns {string} - either the actual name of the medical center or the
 * passed in id if no match was found
 */
export function getMedicalCenterNameByID(facilityId) {
  if (!facilityId || typeof facilityId !== 'string') {
    return '';
  }
  const [id] = facilityId.split(' - ');
  return medicalCenterLabels[id] || facilityId;
}

export const dischargeTypeLabels = {
  honorable: 'Honorable',
  general: 'General',
  other: 'Other Than Honorable',
  'bad-conduct': 'Bad Conduct',
  dishonorable: 'Dishonorable',
  undesirable: 'Undesirable',
};

export const lastServiceBranchLabels = {
  'air force': 'Air Force',
  army: 'Army',
  'coast guard': 'Coast Guard',
  'marine corps': 'Marine Corps',
  'merchant seaman': 'Merchant Seaman',
  navy: 'Navy',
  noaa: 'Noaa',
  usphs: 'USPHS',
  'f.commonwealth': 'Filipino Commonwealth Army',
  'f.guerilla': 'Filipino Guerilla Forces',
  'f.scouts new': 'Filipino New Scout',
  'f.scouts old': 'Filipino Old Scout',
  other: 'Other',
};

export const financialDisclosureText = (
  <div>
    <p>
      Next, we’ll ask you to provide your financial information from the most
      recent tax year, which we’ll verify with the IRS. We use this information
      to figure out if you:
    </p>

    <ol>
      <li>
        Are eligible for health care even if you don’t have one of the
        qualifying factors
      </li>
      <li>
        Are eligible for added benefits, like reimbusement for travel costs or
        cost-free medications
      </li>
      <li>Should be charged for copays or medication</li>
    </ol>

    <div className="usa-alert usa-alert-info">
      <div className="usa-alert-body">
        <span>
          <strong>Note:</strong> You don’t have to provide your financial
          information. But if you don’t have a qualifying eligibility factor,
          this information is the only other way for us to see if you can get VA
          health care benefits--including added benefits like waived copays.
        </span>
      </div>
    </div>
    <p>Qualifying factors:</p>
    <ul>
      <li>Former Prisoner of War</li>
      <li>Received a Purple Heart</li>
      <li>Recently discharged combat Veteran</li>
      <li>
        Discharged for a disability that resulted from your service or got worse
        in the line of duty
      </li>
      <li>Getting VA service-connected disability compensation</li>
      <li>Getting a VA pension</li>
      <li>Receiving Medicaid benefits</li>
      <li>Served in Vietnam between January 9, 1962, and May 7, 1975</li>
      <li>
        Served in Southwest Asia during the Gulf War between August 2, 1990, and
        November 11, 1998
      </li>
      <li>
        Served at least 30 days at Camp Lejeune between August 1, 1953, and
        December 31, 1987
      </li>
    </ul>

    <div className="input-section">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="http://www.va.gov/healthbenefits/cost/income_thresholds.asp"
      >
        Learn more
      </a>{' '}
      about our income thresholds (also called income limits) and copayments.
    </div>
  </div>
);

export const incomeDescription = (
  <div>
    <p>
      Please fill this section out to the best of your knowledge. Provide the
      previous calendar year’s gross annual income for you, your spouse, and
      your dependents.
    </p>
    <p>
      <strong>Gross annual income:</strong> This income is from employment only,
      and doesn’t include income from your farm, ranch, property, or business.
      When you calculate your gross annual income, include your wages, bonuses,
      tips, severance pay, and other accrued benefits. Include your dependent’s
      income information if it could have been used to pay your household
      expenses.
    </p>
    <p>
      <strong>Net income:</strong> This is the income from your farm, ranch,
      property, or business.
    </p>
    <p>
      <strong>Other income:</strong> This includes retirement and pension
      income; Social Security Retirement and Social Security Disability income;
      compensation benefits such as VA disability, unemployment, Workers, and
      black lung; cash gifts; interest and dividends, including tax exempt
      earnings and distributions from Individual Retirement Accounts (IRAs) or
      annuities.
    </p>
  </div>
);

export const disclosureWarning = (
  <div className="usa-alert usa-alert-info">
    <div className="usa-alert-body">
      <span>
        If you don’t provide your financial information and you don’t have
        another qualifying eligibility factor, VA can’t enroll you.
      </span>
    </div>
  </div>
);

export const expensesGreaterThanIncomeWarning = (
  <div className="usa-alert usa-alert-warning">
    <div className="usa-alert-body">
      <h2 className="usa-alert-heading">
        Your expenses are higher than or equal to your income.
      </h2>
      <p className="usa-alert-text">
        You can stop entering your expenses. We’ll adjust your expenses to be
        equal to your income. This won’t affect your application or benefits.
      </p>
    </div>
  </div>
);

export function expensesLessThanIncome(fieldShownUnder) {
  const fields = [
    'deductibleMedicalExpenses',
    'deductibleFuneralExpenses',
    'deductibleEducationExpenses',
  ];
  return formData => {
    const {
      veteranGrossIncome = 0,
      veteranNetIncome = 0,
      veteranOtherIncome = 0,
      dependents = [],
    } = formData;

    const {
      spouseGrossIncome = 0,
      spouseNetIncome = 0,
      spouseOtherIncome = 0,
    } = formData['view:spouseIncome'] || {};

    const vetSpouseIncome =
      veteranGrossIncome +
      veteranNetIncome +
      veteranOtherIncome +
      spouseGrossIncome +
      spouseNetIncome +
      spouseOtherIncome;

    const income = dependents.reduce((sum, dependent) => {
      const { grossIncome = 0, netIncome = 0, otherIncome = 0 } = dependent;

      return grossIncome + netIncome + otherIncome + sum;
    }, vetSpouseIncome);

    const {
      deductibleMedicalExpenses = 0,
      deductibleFuneralExpenses = 0,
      deductibleEducationExpenses = 0,
    } = formData;

    const expenses =
      deductibleMedicalExpenses +
      deductibleEducationExpenses +
      deductibleFuneralExpenses;

    const hideBasedOnValues = income > expenses;

    // If we're not going to hide based on values entered,
    // then we need to make sure the current field is the last non-empty field
    if (!hideBasedOnValues) {
      const nonEmptyFields = fields.filter(field => formData[field]);
      if (
        !nonEmptyFields.length ||
        nonEmptyFields[nonEmptyFields.length - 1] !== fieldShownUnder
      ) {
        return true;
      }

      return false;
    }

    return true;
  };
}

export const deductibleExpensesDescription = (
  <div>
    Tell us a bit about your expenses this past calendar year. Enter information
    for any expenses that apply to you.
    <div className="hca-tooltip-wrapper">
      <AdditionalInfo triggerText="What if my expenses are higher than my annual income?">
        We understand in some cases your expenses might be higher than your
        income. If your expenses exceed your income, we’ll adjust them to be
        equal to your income. This won’t affect your application or benefits.
      </AdditionalInfo>
    </div>
  </div>
);
export const isEssentialAcaCoverageDescription = (
  <div>
    I’m enrolling to get minimum essential coverage under the Affordable Care
    Act.
    <div className="hca-tooltip-wrapper">
      <AdditionalInfo triggerText="Learn more about minimum essential coverage.">
        To avoid the penalty for not having insurance, you must be enrolled in a
        health plan that qualifies as minimum essential coverage. Being signed
        up for VA health care meets the minimum essential coverage requirement
        under the Affordable Care Act.
      </AdditionalInfo>
    </div>
  </div>
);
export const medicaidDescription = (
  <div>
    <div className="hca-tooltip-wrapper">
      <AdditionalInfo triggerText="Learn more about Medicaid.">
        Medicaid is a government health program for eligible low-income
        individuals and families and people with disabilities.
      </AdditionalInfo>
    </div>
  </div>
);
export const medicarePartADescription = (
  <div>
    <div className="hca-tooltip-wrapper">
      <AdditionalInfo triggerText="Learn more about Medicare Part A insurance.">
        Medicare is a federal health insurance program providing coverage for
        people who are 65 years or older or who meet who meet special criteria.
        Part A insurance covers hospital care, skilled nursing and nursing home
        care, hospice, and home health services.
      </AdditionalInfo>
    </div>
  </div>
);

export const idFormSchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      minLength: 1,
      maxLength: 30,
      pattern: '^.*\\S.*',
    },
    lastName: {
      type: 'string',
      minLength: 2,
      maxLength: 30,
      pattern: '^.*\\S.*',
    },
    dob: {
      type: 'string',
      format: 'date',
    },
    ssn: {
      type: 'string',
      pattern: '^[0-9]{9}$',
    },
  },
  required: ['firstName', 'lastName', 'dob', 'ssn'],
};

export const idFormUiSchema = {
  firstName: {
    'ui:title': 'First name',
    'ui:errorMessages': {
      required: 'Please enter a first name.',
    },
  },
  lastName: {
    'ui:title': 'Last name',
    'ui:errorMessages': {
      required: 'Please enter a last name.',
    },
  },
  dob: {
    ...currentOrPastDateUI('Date of birth'),
    'ui:errorMessages': {
      required:
        'Please provide your date of birth. Select the month and day, then enter your birth year.',
    },
  },
  ssn: {
    ...ssnUI,
    'ui:errorMessages': {
      required: 'Please enter a Social Security number',
      // NOTE: this `pattern` message is ignored because the pattern
      // validation error message is hard coded in the validation function:
      // https://github.com/usds/us-forms-system/blob/db029cb4f18362870d420e3eee5b71be98004e5e/src/js/validation.js#L231
      pattern:
        'Please enter a Social Security number in this format: XXX-XX-XXXX.',
    },
  },
};

/**
 *
 * Provides the current Central Time CT offset according to whether or not daylight savings is in effect
 * @export
 * @param {boolean} isDST
 * @returns {number} offset in minutes
 */
export function getCSTOffset(isDST) {
  const offsetHours = isDST ? -5 : -6;
  return offsetHours * 60;
}

/**
 *
 * Converts a timezone offset into milliseconds
 * @export
 * @param {number} offset (in minutes)
 */
export function getOffsetTime(offset) {
  return 60000 * offset;
}

/**
 *
 * Adjusts a given time using an offset
 * @export
 * @param {number} time (in milliseconds)
 * @param {number} offset (in milliseconds)
 */
export function getAdjustedTime(time, offset) {
  return time + offset;
}

/**
 * Provides a current date object in Central Time CT
 * Adapted from https://stackoverflow.com/a/46355483 and https://stackoverflow.com/a/17085556
 */
export function getCSTDate() {
  const today = new Date();
  const isDST = moment().isDST();
  const cstOffset = getCSTOffset(isDST);

  // The UTC and Central Time times are defined in milliseconds
  // UTC time is determined by adding the local offset to the local time
  const utcTime = getAdjustedTime(
    today.getTime(),
    getOffsetTime(today.getTimezoneOffset()),
  );

  // Central Time is determined by adjusting the UTC time (derived above) using the CST offset
  const centralTime = getAdjustedTime(utcTime, getOffsetTime(cstOffset));
  return new Date(centralTime);
}

export function isBeforeCentralTimeDate(date) {
  const lastDischargeDate = moment(date, 'YYYY-MM-DD');
  const centralTimeDate = moment(getCSTDate());
  return lastDischargeDate.isBefore(centralTimeDate.startOf('day'));
}

export function isAfterCentralTimeDate(date) {
  return !isBeforeCentralTimeDate(date);
}

export function validateDate(date) {
  const newDate = moment(date, 'YYYY-MM-DD');
  const day = newDate.date();
  const month = newDate.month() + 1; // Note: Months are zero indexed, so January is month 0.
  const year = newDate.year();
  return isValidDate(day, month, year);
}

/**
 * Helper that takes two sets of props and returns true if any of its relevant
 * props are different.
 * @param {Object} prevProps - first set of props to compare
 * @param {Object} props - second set of props to compare
 * @returns {boolean} - true if any relevant props differ between the two sets
 * of props; otherwise returns false
 *
 */
export function didEnrollmentStatusChange(prevProps, props) {
  const relevantProps = [
    'enrollmentStatus',
    'noESRRecordFound',
    'shouldRedirect',
  ];
  return relevantProps.some(
    propName => prevProps[propName] !== props[propName],
  );
}
