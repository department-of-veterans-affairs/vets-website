// @ts-check
import {
  titleUI,
  descriptionUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import ToxicExposureDescription from '../../../components/FormDescriptions/ToxicExposureDescription';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...titleUI(content['service-info--toxic-exposure-title']),
    ...descriptionUI(ToxicExposureDescription),
    hasTeraResponse: yesNoUI({
      title: content['service-info--toxic-exposure-label'],
    }),
  },
  schema: {
    type: 'object',
    required: ['hasTeraResponse'],
    properties: {
      hasTeraResponse: yesNoSchema,
    },
  },
};
