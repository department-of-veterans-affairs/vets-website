import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { discloseFinancialInformation } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(content['household-info--financial-disclosure-title']),
    discloseFinancialInformation: {
      'ui:title': content['household-info--financial-disclosure-label'],
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: ['discloseFinancialInformation'],
    properties: {
      discloseFinancialInformation,
    },
  },
};
