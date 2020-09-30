const _ = require('lodash');

module.exports = function phoneNumberArrayToObject(numbers) {
  return numbers.reduce((acc, number) => {
    const phoneType = number.entity.fieldPhoneNumberType;
    const numberWithoutType = _.omit(number.entity, 'fieldPhoneNumberType');
    if (acc[phoneType]) {
      acc[phoneType].push(numberWithoutType);
    } else {
      acc[phoneType] = [numberWithoutType];
    }
    return acc;
  }, {});
};
