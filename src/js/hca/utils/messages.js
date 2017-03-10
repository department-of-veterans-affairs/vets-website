import { isBlank, isValidMonetaryValue } from '../../common/utils/validations';

const getMonetaryErrorMessage = (field) => {
  let result;
  if (field.dirty) {
    if (isBlank(field.value)) {
      result = 'Please enter a number.';
    } else if (!isValidMonetaryValue(field.value)) {
      result = 'Please enter only numbers and a decimal point if necessary (no commas or currency signs)';
    }
  }
  return result;
};

module.exports = {
  getMonetaryErrorMessage
};
