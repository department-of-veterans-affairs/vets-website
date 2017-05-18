import moment from 'moment';
import { convertToDateField } from '../common/schemaform/validation';
import { isValidDateRange } from '../common/utils/validations';

export function validateServiceDates(errors, { lastDischargeDate, lastEntryDate }, { veteranDateOfBirth }) {
  const fromDate = convertToDateField(lastEntryDate);
  const toDate = convertToDateField(lastDischargeDate);

  if (!isValidDateRange(fromDate, toDate)) {
    errors.lastDischargeDate.addError('Discharge date must be after start of service period date and before today');
  }

  if (veteranDateOfBirth) {
    const dateOfBirth = moment(veteranDateOfBirth);

    if (dateOfBirth.add(15, 'years').isAfter(moment(lastEntryDate))) {
      errors.lastEntryDate.addError('You must have been at least 15 years old when you entered the service');
    }
  }
}
