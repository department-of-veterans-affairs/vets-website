// @ts-check
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...titleUI(content['household-info--financial-disclosure-title']),
    discloseFinancialInformation: yesNoUI({
      title: content['household-info--financial-disclosure-label'],
    }),
  },
  schema: {
    type: 'object',
    required: ['discloseFinancialInformation'],
    properties: {
      discloseFinancialInformation: yesNoSchema,
    },
  },
};
