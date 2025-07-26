import {
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { BirthInfoDescription } from '../../../components/FormDescriptions';
import { FULL_SCHEMA, STATES_50_AND_DC } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { cityOfBirth } = FULL_SCHEMA.properties;
const stateValues = [...STATES_50_AND_DC.map(object => object.value), 'Other'];
const stateLabels = [...STATES_50_AND_DC.map(object => object.label), 'Other'];

export default {
  uiSchema: {
    ...titleUI(
      content['vet-info--birthplace-title'],
      content['vet-info--birthplace-description'],
    ),
    ...descriptionUI(BirthInfoDescription),
    'view:placeOfBirth': {
      cityOfBirth: {
        'ui:title': content['vet-info--birthplace-city-label'],
      },
      stateOfBirth: {
        'ui:title': content['vet-info--birthplace-state-label'],
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
            enum: stateValues,
            enumNames: stateLabels,
          },
        },
      },
    },
  },
};
