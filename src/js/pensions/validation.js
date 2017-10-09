import _ from 'lodash/fp';
import { isValidDateRange } from '../common/utils/validations';
import { convertToDateField } from '../common/schemaform/validation';

export function validateAfterMarriageDate(errors, dateOfSeparation, formData, schema, errorMessages, index) {
  const dateOfMarriage = _.get(['marriages', index, 'dateOfMarriage'], formData);

  const fromDate = convertToDateField(dateOfMarriage);
  const toDate = convertToDateField(dateOfSeparation);

  if (!isValidDateRange(fromDate, toDate)) {
    errors.to.addError('Date of separation must be after date of marriage');
  }
}
