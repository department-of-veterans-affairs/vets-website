import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import ToxicExposureDescription from '../../../components/FormDescriptions/ToxicExposureDescription';
import content from '../../../locales/en/content.json';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': content['military-service-toxic-exposure-title'],
    'ui:description': ToxicExposureDescription,
    hasTeraResponse: radioUI({
      title: content['military-service-toxic-exposure-description'],
      labels: {
        '1': 'Yes',
        '2': 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['hasTeraResponse'],
    properties: {
      hasTeraResponse: radioSchema(['1', '2']),
    },
  },
};
