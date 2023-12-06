import moment from 'moment';

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
