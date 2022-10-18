import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';

import CustomReviewField from '../../../components/FormReview/CustomReviewField';
import {
  PensionInfoDescription,
  PensionTypeDescription,
} from '../../../components/FormDescriptions';
import { emptyObjectSchema } from '../../../definitions';

const { vaPensionType } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:title': 'Current compensation from VA',
    'ui:description': PrefillMessage,
    'view:compDesc': {
      'ui:description': PensionInfoDescription,
    },
    vaPensionType: {
      'ui:title': 'Do you receive a Veterans pension from the VA?',
      'ui:description': PensionTypeDescription,
      'ui:reviewField': CustomReviewField,
      'ui:required': () => true,
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          pension: 'Yes',
          none: 'No',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['vaCompensationType'],
    properties: {
      'view:compDesc': emptyObjectSchema,
      vaPensionType,
    },
  },
};
