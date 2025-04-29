import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import { genderLabels } from 'platform/static-data/labels';
import { FULL_SCHEMA } from '../../../utils/imports';

const { gender } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    'ui:description': PrefillMessage,
    gender: {
      'ui:title': 'What sex were you assigned at birth?',
      'ui:widget': 'radio',
      'ui:options': {
        labels: genderLabels,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['gender'],
    properties: { gender },
  },
};
