import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { genderLabels } from 'platform/static-data/labels';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { gender } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(content['vet-info--birth-sex-title']),
    gender: {
      'ui:title': content['vet-info--birth-sex-label'],
      'ui:widget': 'radio',
      'ui:options': {
        labels: genderLabels,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['gender'],
    properties: {
      'view:birthSex': {
        type: 'object',
        properties: {},
      },
      gender,
    },
  },
};
