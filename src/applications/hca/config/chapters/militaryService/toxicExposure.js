import {
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { FULL_SCHEMA } from '../../../utils/imports';
import ToxicExposureDescription from '../../../components/FormDescriptions/ToxicExposureDescription';
import content from '../../../locales/en/content.json';

const { hasTeraResponse } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(content['service-info--toxic-exposure-title']),
    ...descriptionUI(ToxicExposureDescription),
    hasTeraResponse: {
      'ui:title': content['service-info--toxic-exposure-label'],
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
