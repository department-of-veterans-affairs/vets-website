// @ts-check
import {
  titleUI,
  descriptionUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import ToxicExposureDescription from '../../../components/FormDescriptions/ToxicExposureDescription';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { hasTeraResponse } = FULL_SCHEMA.properties;

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
      hasTeraResponse,
    },
  },
};
