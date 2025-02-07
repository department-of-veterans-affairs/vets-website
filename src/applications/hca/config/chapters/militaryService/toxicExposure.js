import { FULL_SCHEMA } from '../../../utils/imports';
import ToxicExposureDescription from '../../../components/FormDescriptions/ToxicExposureDescription';

const { hasTeraResponse } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    'ui:title': 'Toxic exposure',
    'ui:description': ToxicExposureDescription,
    hasTeraResponse: {
      'ui:title':
        'Do you want to answer questions about your military service history and exposure to any toxins or other hazards?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: ['hasTeraResponse'],
    properties: {
      hasTeraResponse,
    },
  },
};
