import moment from 'moment';
import _ from 'lodash/fp';
import { convertToDateField, validateCurrentOrPastDate } from '../common/schemaform/validation';
import { isValidDateRange } from '../common/utils/validations';

export function validateServiceDates(errors, { lastDischargeDate, lastEntryDate }, { veteranDateOfBirth }) {
  const fromDate = convertToDateField(lastEntryDate);
  const toDate = convertToDateField(lastDischargeDate);
  const today = moment().startOf('day');

  if (!isValidDateRange(fromDate, toDate) || moment(lastDischargeDate).isAfter(today)) {
    errors.lastDischargeDate.addError('Discharge date must be after start of service period date and before today');
  }

  if (veteranDateOfBirth) {
    const dateOfBirth = moment(veteranDateOfBirth);

    if (dateOfBirth.add(15, 'years').isAfter(moment(lastEntryDate))) {
      errors.lastEntryDate.addError('You must have been at least 15 years old when you entered the service');
    }
  }
}

export function validateMarriageDate(errors, marriageDate, { spouseDateOfBirth, veteranDateOfBirth, discloseFinancialInformation }) {
  const vetDOB = moment(veteranDateOfBirth);
  const spouseDOB = moment(spouseDateOfBirth);
  const marriage = moment(marriageDate);

  if (discloseFinancialInformation && (vetDOB.isAfter(marriage) || spouseDOB.isAfter(marriage))) {
    errors.addError('Date of marriage cannot be before the Veteran\'s or the spouse\'s date of birth');
  }
  validateCurrentOrPastDate(errors, marriageDate);
}

export function validateDependentDate(errors, dependentDate, formData, schema, messages, index) {
  const dependent = moment(dependentDate);
  const dob = moment(_.get(`children[${index}].childDateOfBirth`, formData));

  if (formData.discloseFinancialInformation && dob.isAfter(dependent)) {
    errors.addError('This date must come after the child\'s birth date');
  }
  validateCurrentOrPastDate(errors, dependentDate);
}
