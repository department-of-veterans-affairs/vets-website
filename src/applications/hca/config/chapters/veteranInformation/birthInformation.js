import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { BirthInfoDescription } from '../../../components/FormDescriptions';
import { FULL_SCHEMA, STATES_50_AND_DC } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { cityOfBirth } = FULL_SCHEMA.properties;

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
            enum: [...STATES_50_AND_DC.map(object => object.value), 'Other'],
            enumNames: [
              ...STATES_50_AND_DC.map(object => object.label),
              'Other',
            ],
          },
        },
      },
    },
  },
};
