import moment from 'moment';
import { HIGH_DISABILITY_MINIMUM } from '../constants';

/**
 * Helper that determines if the form data contains values that allow users
 * to fill out the form using the short form flow
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the total disability rating is greater than or equal
 * to the minimum percetage OR the user self-declares they receive compensation equal to
 * that of a high-disability-rated Veteran.
 */
export function isShortFormEligible(formData) {
  const {
    'view:totalDisabilityRating': disabilityRating,
    vaCompensationType,
  } = formData;
  const hasHighRating = disabilityRating >= HIGH_DISABILITY_MINIMUM;
  const hasHighCompensation = vaCompensationType === 'highDisability';
  return hasHighRating || hasHighCompensation;
}

/**
 * Helper that determines if the form data contains values that require users
 * to fill out spousal information
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user declares they would like to provide their
 * financial data & have a marital status of 'married' or 'separated'.
 */
export function includeSpousalInformation(formData) {
  const { discloseFinancialInformation, maritalStatus } = formData;
  const hasSpouseToDeclare =
    maritalStatus?.toLowerCase() === 'married' ||
    maritalStatus?.toLowerCase() === 'separated';
  return discloseFinancialInformation && hasSpouseToDeclare;
}

/**
 * Helper that determines if the a dependent is of the declared college
 * age of 18-23
 * @param {String} birthdate - the dependents date of birth
 * @param {String} testdate - an optional date to pass for testing purposes
 * @returns {Boolean} - true if the provided date puts the dependent of an
 * age between 18 and 23.
 */
export function isOfCollegeAge(birthdate, testdate = new Date()) {
  const age = Math.abs(moment(birthdate).diff(moment(testdate), 'years'));
  return age >= 18 && age <= 23;
}

/**
 * Helper that builds the list of active pages for use in the dependent
 * information add/edit form
 * @param {Array} subpages - the list of all available pages
 * @param {Object} formData - the current data object for the dependent
 * @returns {Array} - the array of pages to map through
 */
export function getDependentPageList(pages, formData = {}) {
  return pages.reduce((acc, page) => {
    if ('depends' in page) {
      const { key, value } = page.depends;
      if (value instanceof Function) {
        if (value(formData[key])) {
          acc.push(page);
        }
      } else if (formData[key] === value) {
        acc.push(page);
      }
    } else {
      acc.push(page);
    }
    return acc;
  }, []);
}
