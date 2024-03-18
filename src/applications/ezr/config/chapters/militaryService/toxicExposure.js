import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import ToxicExposureDescription from '../../../components/FormDescriptions/ToxicExposureDescription';

const { hasTeraResponse } = ezrSchema.properties;

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
