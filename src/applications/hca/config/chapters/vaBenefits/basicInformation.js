import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';

const { vaCompensationType } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:title': 'Current compensation',
    'ui:description': PrefillMessage,
    vaCompensationType: {
      'ui:title': 'Which type of VA compensation do you currently receive?',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          lowDisability:
            'Service-connected disability pay for a 10%, 20%, 30%, or 40% disability rating',
          highDisability:
            'Service-connected disability pay for a 50% or higher disability rating',
          pension: 'VA pension',
          none: 'I don’t receive any VA pay',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['vaCompensationType'],
    properties: {
      vaCompensationType,
    },
  },
};
