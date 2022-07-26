import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

const { ssn } = fullSchemaHca.definitions;

export default {
  uiSchema: {
    veteranSocialSecurityNumber: ssnUI,
  },
  schema: {
    type: 'object',
    required: ['veteranSocialSecurityNumber'],
    properties: {
      veteranSocialSecurityNumber: ssn.oneOf[0],
    },
  },
};
