import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import constants from 'vets-json-schema/dist/constants.json';

import AuthenticatedShortFormAlert from '../../../components/FormAlerts/AuthenticatedShortFormAlert';
import { BirthInfoDescription } from '../../../components/FormDescriptions';

import { emptyObjectSchema, NotHighDisability } from '../../../helpers';

const { cityOfBirth } = fullSchemaHca.properties;
const { states50AndDC } = constants;

export default {
  uiSchema: {
    'view:authShortFormAlert': {
      'ui:field': AuthenticatedShortFormAlert,
      'ui:options': {
        hideIf: NotHighDisability,
      },
    },
    'view:placeOfBirth': {
      'ui:title': 'Your place of birth',
      'ui:description': BirthInfoDescription,
      cityOfBirth: {
        'ui:title': 'City',
      },
      stateOfBirth: {
        'ui:title': 'State/Province/Region',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:authShortFormAlert': emptyObjectSchema,
      'view:placeOfBirth': {
        type: 'object',
        properties: {
          cityOfBirth,
          stateOfBirth: {
            type: 'string',
            enum: [...states50AndDC.map(object => object.value), 'Other'],
            enumNames: [...states50AndDC.map(object => object.label), 'Other'],
          },
        },
      },
    },
  },
};
