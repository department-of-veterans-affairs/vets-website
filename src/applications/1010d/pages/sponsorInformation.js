import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import fullSchema from '../10-10D-schema.json';

const { veteran } = fullSchema.properties;

export default {
  uiSchema: {
    veteran: {
      fullName: fullNameUI,
      ssnOrTin: ssnUI,
      phoneNumber: phoneUI(),
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteran,
    },
  },
};
