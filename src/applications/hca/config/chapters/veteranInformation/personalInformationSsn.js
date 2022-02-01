import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

const { ssn } = fullSchemaHca.definitions;

export default {
  uiSchema: {
    'ui:description': PrefillMessage,
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
