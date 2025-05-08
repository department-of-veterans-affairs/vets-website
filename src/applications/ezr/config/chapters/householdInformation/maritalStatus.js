import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import PrefillMessage from '@department-of-veterans-affairs/platform-forms/save-in-progress/PrefillMessage';
import {
  titleUI,
  descriptionUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import VaSelectField from '@department-of-veterans-affairs/platform-forms-system/web-component-fields/VaSelectField';
import MaritalStatusDescription from '../../../components/FormDescriptions/MaritalStatusDescription';
import content from '../../../locales/en/content.json';

const { maritalStatus } = ezrSchema.properties;

export default {
  uiSchema: {
    ...descriptionUI(PrefillMessage, { hideOnReview: true }),
    'view:maritalStatus': {
      ...titleUI(content['household-marital-status-title']),
      ...descriptionUI(MaritalStatusDescription, { hideOnReview: true }),
      maritalStatus: {
        'ui:title': content['household-marital-status-label'],
        'ui:webComponentField': VaSelectField,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:maritalStatus': {
        type: 'object',
        required: ['maritalStatus'],
        properties: {
          maritalStatus,
        },
      },
    },
  },
};
