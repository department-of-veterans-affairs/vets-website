import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import ToxicExposureDescription from '../../../components/FormDescriptions/ToxicExposureDescription';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    'ui:title': content['military-service-toxic-exposure-title'],
    'ui:description': ToxicExposureDescription,
    hasTeraResponse: yesNoUI(
      content['military-service-toxic-exposure-description'],
    ),
  },
  schema: {
    type: 'object',
    required: ['hasTeraResponse'],
    properties: {
      hasTeraResponse: yesNoSchema,
    },
  },
};
