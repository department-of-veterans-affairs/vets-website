import get from '@department-of-veterans-affairs/platform-forms-system/get';
import { differenceInYears, format, isMatch, parse, addYears } from 'date-fns';
import content from '../../locales/en/content.json';
import { replaceStrValues } from './formatting';

/**
 * Normalizes a Date object to UTC midnight (00:00:00.000).
 * @param {Date} d - The date to normalize
 * @returns {Date} A new Date object set to midnight UTC
 */
const toUtcMidnight = d =>
  new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

/**
 * Creates a function that generates modal titles or descriptions based on item/noun context.
 * @param {string} itemKey - Content key to use when item name exists
 * @param {string} nounKey - Content key to use when item name does not exist
 * @returns {Function} Function that accepts props and returns formatted content string
 *
 * @example
 * const cancelEditTitle = createModalTitleOrDescription(
 *   'health-insurance--cancel-edit-item-title',
 *   'health-insurance--cancel-edit-noun-title',
 * );
 * // Later called with props: cancelEditTitle(props) -> 'Cancel editing Blue Cross?'
 */
export const createModalTitleOrDescription = (itemKey, nounKey) => props => {
  const itemName = props.getItemName(
    props.itemData,
    props.index,
    props.formData,
  );
  const contentKey = itemName ? itemKey : nounKey;
  const replacementValue = itemName || props.nounSingular;
  return replaceStrValues(content[contentKey], replacementValue);
};

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
 * Determines if a birth certificate is required for an applicant.
 * Birth certificates are required for:
 * - Non-biological children (adopted or stepchildren) of any age
 * - Biological children who are 1 year old or younger (newborns)
 *
 * @param {object} formData - Standard formData object
 * @param {number} index - Index of the applicant in the applicants array
 * @returns {boolean} True if birth certificate is required, false otherwise
 */
export const requireBirthCertificate = (formData, index) => {
  const applicant = formData?.applicants?.[index];
  const relationshipToSponsor =
    applicant?.applicantRelationshipToSponsor?.relationshipToVeteran;
  const relationshipOrigin =
    applicant?.applicantRelationshipOrigin?.relationshipToVeteran;

  const isChild = relationshipToSponsor === 'child';
  const isNotBiologicalChild = relationshipOrigin !== 'blood';

  if (!isChild) return false;
  if (isNotBiologicalChild) return true;
  if (!applicant?.applicantDob) return false;

  const dobDate = new Date(applicant.applicantDob);
  if (Number.isNaN(dobDate.getTime())) return false;

  // For biological child, check if newborn (1 year or less)
  const dobUTC = toUtcMidnight(dobDate);
  const oneYearAgo = toUtcMidnight(addYears(new Date(), -1));
  return dobUTC >= oneYearAgo;
};

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
  const dobUTC = toUtcMidnight(parsed);
  const asOfUTC = toUtcMidnight(asOf);

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
