import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';

import {
  CompensationInfoDescription,
  CompensationTypeDescription,
} from '../../../components/FormDescriptions';
import { emptyObjectSchema } from '../../../definitions';

const { vaCompensationType } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:title': 'Current compensation from VA',
    'ui:description': PrefillMessage,
    'view:compDesc': {
      'ui:description': CompensationInfoDescription,
    },
    vaCompensationType: {
      'ui:title': 'Do you receive VA disability compensation?',
      'ui:description': CompensationTypeDescription,
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          lowDisability:
            'Yes, for a service-connected disability rating of up to 40%',
          highDisability:
            'Yes, for a service-connected disability rating of 50% or higher',
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
      vaCompensationType,
    },
  },
};
