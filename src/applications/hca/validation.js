import { addYears, endOfDay, format, isAfter } from 'date-fns';
import {
  convertToDateField,
  validateCurrentOrPastDate,
} from 'platform/forms-system/src/js/validation';
import { isValidDateRange } from '../../platform/forms/validations';

function calculateEndDate() {
  const endDateLimit = 1;
  const description = '1 year';

  return {
    endDateLimit,
    description,
    endDate: addYears(endOfDay(Date.now()), endDateLimit),
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
    isAfter(Date.parse(lastDischargeDate), endDateInfo.endDate)
  ) {
    errors.lastDischargeDate.addError(
      `Discharge date must be after the service period start date and before ${format(
        endDateInfo.endDate,
        'MMMM d, yyyy',
      )} (${endDateInfo.description} from today)`,
    );
  }

  if (veteranDateOfBirth) {
    const dateOfBirth = Date.parse(veteranDateOfBirth);

    if (isAfter(addYears(dateOfBirth, 15), Date.parse(lastEntryDate))) {
      errors.lastEntryDate.addError(
        'You must have been at least 15 years old when you entered the service',
      );
    }
  }
}

export function validateMarriageDate(
  errors,
  marriageDate,
  { spouseDateOfBirth, veteranDateOfBirth, discloseFinancialInformation },
) {
  const vetDOB = Date.parse(veteranDateOfBirth);
  const spouseDOB = Date.parse(spouseDateOfBirth);
  const marriage = Date.parse(marriageDate);

  if (
    discloseFinancialInformation &&
    (isAfter(vetDOB, marriage) || isAfter(spouseDOB, marriage))
  ) {
    errors.addError(
      'Date of marriage cannot be before the Veteran’s or the spouse’s date of birth',
    );
  }
  validateCurrentOrPastDate(errors, marriageDate);
}

export function validateDependentDate(errors, dependentDate, formData) {
  const dependent = Date.parse(dependentDate);

  if (formData.discloseFinancialInformation && isAfter(Date.now(), dependent)) {
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
