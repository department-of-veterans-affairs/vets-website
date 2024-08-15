import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import constants from 'vets-json-schema/dist/constants.json';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { BirthInfoDescription } from '../../../components/FormDescriptions';
import content from '../../../locales/en/content.json';

const { cityOfBirth } = fullSchemaHca.properties;
const { states50AndDC } = constants;

export default {
  uiSchema: {
    ...titleUI(
      content['vet-info--birthplace-title'],
      content['vet-info--birthplace-description'],
    ),
    'ui:description': BirthInfoDescription,
    'view:placeOfBirth': {
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
