import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import { createUSAStateLabels } from 'platform/forms-system/src/js/helpers';
import { states } from 'platform/forms/address';

const { cityOfBirth } = fullSchemaHca.properties;

const { date, ssn } = fullSchemaHca.definitions;

const stateLabels = createUSAStateLabels(states);

export default {
  uiSchema: {
    'ui:description': PrefillMessage,
    veteranDateOfBirth: currentOrPastDateUI('Date of birth'),
    veteranSocialSecurityNumber: ssnUI,
    'view:placeOfBirth': {
      'ui:title': 'Place of birth',
      cityOfBirth: {
        'ui:title': 'City',
      },
      stateOfBirth: {
        'ui:title': 'State',
        'ui:options': {
          labels: stateLabels,
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['veteranDateOfBirth', 'veteranSocialSecurityNumber'],
    properties: {
      veteranDateOfBirth: date,
      veteranSocialSecurityNumber: ssn.oneOf[0],
      'view:placeOfBirth': {
        type: 'object',
        properties: {
          cityOfBirth,
          stateOfBirth: {
            type: 'string',
            enum: states.USA.map(state => state.value),
          },
        },
      },
    },
  },
};
