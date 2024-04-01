import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import ToxicExposureDescription from '../../../components/FormDescriptions/ToxicExposureDescription';
import content from '../../../locales/en/content.json';

const { hasTeraResponse } = ezrSchema.properties;

export default {
  uiSchema: {
    'ui:title': content['military-service-toxic-exposure-title'],
    'ui:description': ToxicExposureDescription,
    hasTeraResponse: {
      'ui:title': content['military-service-toxic-exposure-description'],
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
