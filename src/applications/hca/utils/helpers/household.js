import { differenceInYears } from 'date-fns';

/**
 * Helper that determines if the a dependent is of the declared college
 * age of 18-23 and has gross income
 * @param {String} formData - the local form data
 * @param {String} testdate - an optional date to pass for testing purposes
 * @returns {Boolean} - true if the provided date puts the dependent of an
 * age between 18 and 23 and if gross income is greater than 0.
 */
export function canHaveEducationExpenses(formData, testdate = new Date()) {
  const { dateOfBirth } = formData;
  const { grossIncome = 0 } = formData['view:grossIncome'] || {};
  const age = Math.abs(differenceInYears(testdate, new Date(dateOfBirth)));
  const hasGrossIncome = parseFloat(grossIncome).toFixed(2) > 0;
  return age >= 18 && age <= 23 && hasGrossIncome;
}
