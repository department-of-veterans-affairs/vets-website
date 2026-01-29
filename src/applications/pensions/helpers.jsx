import React from 'react';
import { isBefore, isAfter, isEqual, parseISO } from 'date-fns';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

export const isSameOrBefore = (date1, date2) => {
  return isBefore(date1, date2) || isEqual(date1, date2);
};

export const isSameOrAfter = (date1, date2) => {
  return isAfter(date1, date2) || isEqual(date1, date2);
};

export const formatCurrency = num => `$${num.toLocaleString()}`;

const warDates = [
  ['1916-05-09', '1917-04-05'], // Mexican Border Period (May 9, 1916 - April 5, 1917)
  ['1917-04-06', '1918-11-11'], // World War I (April 6, 1917 - November 11, 1918)
  ['1941-12-07', '1946-12-31'], // World War II (December 7, 1941 - December 31, 1946)
  ['1950-06-27', '1955-01-31'], // Korean Conflict (June 27, 1950 - January 31, 1955)
  ['1964-08-05', '1975-05-07'], // Vietnam Era (August 5, 1964 - May 7, 1975)
  ['1990-08-02'], // Gulf War (August 2, 1990)
];

/**
 * @typedef {object} PeriodProps
 * @property {string} from - The start date of the service period
 * @property {string} to - The end date of the service period
 *
 * @param {PeriodProps} period - The date period with from and to dates
 * @returns {boolean} Whether the period overlaps with any wartime period
 */
export function servedDuringWartime(period) {
  return warDates.some(warTime => {
    const [warStart, warEnd] = warTime;
    const { from: periodStart, to: periodEnd } = period;

    // If the service period starts before the war ends and finishes after the
    // war begins, they served during a wartime.
    const overlap =
      isSameOrAfter(parseISO(periodEnd), parseISO(warStart)) &&
      isSameOrBefore(parseISO(periodStart), parseISO(warEnd));

    return warEnd
      ? overlap
      : isSameOrBefore(parseISO(warStart), parseISO(periodEnd));
  });
}

export const DependentsMinItem = (
  <span>
    If you are claiming child dependents,{' '}
    <strong>you must add at least one</strong> here.
  </span>
);

export const DependentSeriouslyDisabledDescription = (
  <div className="vads-u-padding-y--1">
    <va-additional-info trigger="What do we mean by seriously disabled?">
      <span>
        A child is seriously disabled if they developed a permanent physical or
        mental disability before they turned 18 years old. A seriously disabled
        child can’t support or care for themselves.
      </span>
    </va-additional-info>
  </div>
);

export const IncomeSourceDescription = (
  <>
    <p>
      We want to know more about the gross monthly income you, your spouse, and
      your dependents receive.
    </p>
    <p>List the sources of income for you, your spouse, and your dependents.</p>
  </>
);

/**
 * Formats a full name from the given first, middle, last, and suffix
 *
 * @export
 * @param {*} {
 *   first = '',
 *   middle = '',
 *   last = '',
 *   suffix = '',
 * }
 * @return {string} The full name formatted with spaces
 */
export const formatFullName = ({
  first = '',
  middle = '',
  last = '',
  suffix = '',
}) => {
  // ensure that any middle initials are capitalized
  const formattedMiddle = middle
    ? middle.replaceAll(/\b\w\b/g, c => c.toUpperCase())
    : '';
  return [first, formattedMiddle, last, suffix]
    .filter(name => !!name)
    .join(' ');
};

/**
 * Converts any string (e.g., a person's name or noun) to its possessive form.
 * - "Johnson" -> "Johnson’s"
 * - "Williams" -> "Williams’"
 * - "Business" -> "Business’"
 * - "Emma Lee" -> "Emma Lee’s"
 *
 * @param {string} str - The string to convert (e.g., full name or label)
 * @returns {string} - Possessive form of the string
 */
export const formatPossessiveString = str => {
  if (!str || typeof str !== 'string') return '';
  return str.endsWith('s') ? `${str}’` : `${str}’s`;
};

/**
 * Determine if home acreage is more than two acres
 * @param {object} formData - Full form data
 * @returns {boolean} True if home acreage is more than two acres, otherwise false
 */
export function isHomeAcreageMoreThanTwo(formData) {
  return (
    formData.homeOwnership === true && formData.homeAcreageMoreThanTwo === true
  );
}

export const getJobTitleOrType = item => {
  if (item?.jobTitle) return item.jobTitle;
  if (item?.jobType) return item.jobType;
  return '';
};

export const obfuscateAccountNumber = accountNumber => {
  // Replace all digits except the last 4 with asterisks (*)
  return accountNumber.replace(/\d(?=\d{4})/g, '*');
};

export const isProductionEnv = () => {
  return (
    !environment.BASE_URL.includes('localhost') &&
    !window.DD_RUM?.getInitConfiguration() &&
    !window.Mocha
  );
};

export const showMultiplePageResponse = () =>
  window.sessionStorage.getItem('showMultiplePageResponse') === 'true';

export const showPdfFormAlignment = () =>
  window.sessionStorage.getItem('showPdfFormAlignment') === 'true';
