import moment from 'moment';
import * as Sentry from '@sentry/browser';
import get from 'platform/utilities/data/get';

import {
  convertToDateField,
  validateCurrentOrPastDate,
} from 'platform/forms-system/src/js/validation';
import { isValidDateRange } from 'platform/forms/validations';

function calculateEndDate() {
  const endDateLimit = 1;
  const description = '1 year';

  return {
    endDateLimit,
    description,
    endDate: moment()
      .endOf('day')
      .add(endDateLimit, 'years'),
  };
}

export function validateServiceDates(
  errors,
  { lastDischargeDate, lastEntryDate },
  { veteranDateOfBirth },
) {
  const fromDate = convertToDateField(lastEntryDate);
  const toDate = convertToDateField(lastDischargeDate);
  const endDateInfo = calculateEndDate();

  // TODO: Use a constant instead of a magic string
  if (
    !isValidDateRange(fromDate, toDate) ||
    moment(lastDischargeDate, 'YYYY-MM-DD').isAfter(endDateInfo.endDate)
  ) {
    errors.lastDischargeDate.addError(
      `Discharge date must be after the service period start date and before ${endDateInfo.endDate.format(
        'MMMM D, YYYY',
      )} (${endDateInfo.description} from today)`,
    );
  }

  if (veteranDateOfBirth) {
    const dateOfBirth = moment(veteranDateOfBirth);

    if (dateOfBirth.add(15, 'years').isAfter(moment(lastEntryDate))) {
      errors.lastEntryDate.addError(
        'You must have been at least 15 years old when you entered the service',
      );
    }
  }
}

function logMarriageError(
  messageType,
  errorMessage,
  spouseDateOfBirth,
  veteranDateOfBirth,
  marriageDate,
) {
  Sentry.withScope(scope => {
    const message = `hca_1010ez_error_${messageType}`;
    const momentVetDOB = moment(veteranDateOfBirth, 'YYYY-MM-DD');
    const momentSpouseDOB = moment(spouseDateOfBirth, 'YYYY-MM-DD');
    const momentMarriage = moment(marriageDate, 'YYYY-MM-DD');
    const momentNoFormatVetDOB = moment(veteranDateOfBirth);
    const momentNoFormatSpouseDOB = moment(spouseDateOfBirth);
    const momentNoFormatMarriage = moment(marriageDate);
    scope.setContext(message, {
      spouseDateOfBirth,
      veteranDateOfBirth,
      marriageDate,
      momentSpouseDOB,
      momentVetDOB,
      momentMarriage,
      momentNoFormatVetDOB,
      momentNoFormatSpouseDOB,
      momentNoFormatMarriage,
      errorMessage,
    });
    Sentry.captureMessage(message);
  });
}

export function validateMarriageDate(
  errors,
  marriageDate,
  { spouseDateOfBirth, veteranDateOfBirth, discloseFinancialInformation },
) {
  const vetDOB = moment(veteranDateOfBirth);
  const spouseDOB = moment(spouseDateOfBirth);
  const marriage = moment(marriageDate);
  if (
    discloseFinancialInformation &&
    spouseDOB.isAfter(marriage) &&
    vetDOB.isAfter(marriage)
  ) {
    // errors.addError(
    //   'Date of marriage cannot be before the Veteran’s or the spouse’s date of birth',
    // );
    logMarriageError(
      'marriage_date',
      'Date of marriage cannot be before the Veteran’s or the spouse’s date of birth',
      spouseDateOfBirth,
      veteranDateOfBirth,
      marriageDate,
    );
  } else if (discloseFinancialInformation && spouseDOB.isAfter(marriage)) {
    // errors.addError(
    //   'Date of marriage cannot be before the spouse’s date of birth',
    // );
    logMarriageError(
      'spouse_dob',
      'Date of marriage cannot be before the spouse’s date of birth',
      spouseDateOfBirth,
      veteranDateOfBirth,
      marriageDate,
    );
  } else if (discloseFinancialInformation && vetDOB.isAfter(marriage)) {
    // errors.addError(
    //   'Date of marriage cannot be before the Veteran’s date of birth',
    // );
    logMarriageError(
      'veteran_dob',
      'Date of marriage cannot be before the Veteran’s date of birth',
      spouseDateOfBirth,
      veteranDateOfBirth,
      marriageDate,
    );
  }
  validateCurrentOrPastDate(errors, marriageDate);
}

export function validateDependentDate(
  errors,
  dependentDate,
  formData,
  schema,
  messages,
  index,
) {
  const dependent = moment(dependentDate);
  const dob = moment(get(`dependents[${index}].dateOfBirth`, formData));

  if (formData.discloseFinancialInformation && dob.isAfter(dependent)) {
    errors.addError('This date must come after the dependent’s birth date');
  }
  validateCurrentOrPastDate(errors, dependentDate);
}

export function validateCurrency(errors, currencyAmount) {
  // Source: https://stackoverflow.com/a/16242575
  // HACK: Due to us-forms-system issue 269 (https://github.com/usds/us-forms-system/issues/269)
  if (
    !/(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/.test(
      currencyAmount,
    )
  ) {
    errors.addError('Please enter a valid dollar amount');
  }
}
