import { differenceInYears, format, isMatch, parse } from 'date-fns';
import get from '@department-of-veterans-affairs/platform-forms-system/get';

// Only show address dropdown if we're not the certifier
// AND there's another address present to choose from:
export function page15aDepends(formData, index) {
  const certifierIsApp = get('certifierRole', formData) === 'applicant';
  const certAddress = get('street', formData?.certifierAddress);

  return (
    (index && index > 0) || (certAddress && !(certifierIsApp && index === 0))
  );
}

/**
 * Adds a new `applicant` object to the start of the `formData.applicants`
 * array. This is used to add the certifier info to the first applicant
 * slot so users don't have to enter info twice if the certifier is also an app.
 * @param {object} formData standard formData object
 * @param {object} name standard fullNameUI name to populate
 * @param {string} email email address to populate
 * @param {string} phone phone number to populate
 * @param {object} address standard addressUI address object to populate
 */
export function populateFirstApplicant(formData, name, email, phone, address) {
  const modifiedFormData = formData; // changes will affect original formData
  const newApplicant = {
    applicantName: name,
    applicantEmailAddress: email,
    applicantAddress: address,
    applicantPhone: phone,
  };
  if (modifiedFormData.applicants) {
    // Get index of existing applicant w/ same name OR phone+email
    const matchIndex = modifiedFormData.applicants.findIndex(
      a =>
        JSON.stringify(a.applicantName) === JSON.stringify(name) ||
        (a.applicantEmailAddress === email && a.applicantPhone === phone),
    );

    if (matchIndex === -1) {
      modifiedFormData.applicants = [
        newApplicant,
        ...modifiedFormData.applicants,
      ];
    } else if (matchIndex === 0) {
      // If match found at first spot in applicant array, override:
      modifiedFormData.applicants[matchIndex] = {
        ...modifiedFormData.applicants[matchIndex],
        ...newApplicant,
      };
    }
  } else {
    // No applicants yet. Create array and add ours:
    modifiedFormData.applicants = [newApplicant];
  }
  return modifiedFormData;
}

/**
 * Returns the integer age in full years as of a given date.
 *
 * Accepts birthdates in either `yyyy-MM-dd` (ISO) or `MM-dd-yyyy` formats.
 * Parsing is explicit via date-fns; both the DOB and the "as of" date are
 * normalized to UTC midnight to avoid timezone/DST edge cases.
 *
 * @param {string} dateStr - Birthdate string in `yyyy-MM-dd` or `MM-dd-yyyy` format.
 * @param {Date} [asOf=new Date()] - The date on which to calculate age.
 * @returns {number} Age in full years, or `NaN` if the input is invalid.
 *
 * @example
 * getAgeInYears('1958-01-01');       // -> 67 (depending on today's date)
 * getAgeInYears('01-01-1958');       // -> 67
 * getAgeInYears('not-a-date');       // -> NaN
 */
export const getAgeInYears = (dateStr, asOf = new Date()) => {
  if (typeof dateStr !== 'string' || dateStr.length < 10) return NaN;
  let parsed;

  // accept & enforce either ISO `yyyy-MM-dd` or US `MM-dd-yyyy` format
  if (isMatch(dateStr, 'yyyy-MM-dd')) {
    parsed = parse(dateStr, 'yyyy-MM-dd', new Date());
    if (format(parsed, 'yyyy-MM-dd') !== dateStr) return NaN;
  } else if (isMatch(dateStr, 'MM-dd-yyyy')) {
    parsed = parse(dateStr, 'MM-dd-yyyy', new Date());
    if (format(parsed, 'MM-dd-yyyy') !== dateStr) return NaN;
  } else {
    return NaN;
  }

  // normalize both to UTC midnight to avoid TZ/DST edge cases
  const dobUTC = new Date(
    Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()),
  );
  const asOfUTC = new Date(
    Date.UTC(asOf.getUTCFullYear(), asOf.getUTCMonth(), asOf.getUTCDate()),
  );

  return differenceInYears(asOfUTC, dobUTC);
};

/**
 * Helper that determines if a birthdate is between the age of 18-23
 * @param {String|Date} birthdate - the birthdate to evaluate
 * @param {String|Date} testdate - an optional date to pass for testing purposes
 * @returns {Boolean} - true if the provided date is between 18 and 23 years from the test date
 */
export const isOfCollegeAge = (birthdate, testdate = new Date()) => {
  const age = getAgeInYears(birthdate, testdate);
  return age >= 18 && age <= 23;
};
