import moment from 'moment';
import isPlainObject from 'react-redux/lib/utils/isPlainObject';

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

export function hasGrossIncome(income) {
  return income >= 1;
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
      /*
      Some pages can depend on more than one key/value pair, so we'll compare the amount of
      truthy conditionals to the total length of the 'depends' array.
      */
      let truthyConditionalCount = 0;

      for (const depends of page.depends) {
        /*
          Some values are objects themselves. In those cases, we need to grab the value of the
          first key in the object
        */
        const formDataValue = isPlainObject(formData[depends.key])
          ? Object.values(formData[depends.key])[0]
          : formData[depends.key];

        if (depends.value instanceof Function) {
          if (depends.value(formDataValue)) {
            truthyConditionalCount += 1;
          }
        } else if (formDataValue === depends.value) {
          truthyConditionalCount += 1;
        }
      }
      // Compare the conditional count to the 'depends' array length
      if (truthyConditionalCount === page.depends.length) {
        acc.push(page);
      }
    } else {
      acc.push(page);
    }
    return acc;
  }, []);
}
