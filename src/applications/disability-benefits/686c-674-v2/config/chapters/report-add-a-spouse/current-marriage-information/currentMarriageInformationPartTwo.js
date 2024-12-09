import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { generateHelpText } from '../../../helpers';

export const schema = {
  type: 'object',
  properties: {
    doesLiveWithSpouse: {
      type: 'object',
      properties: {
        spouseIncome: yesNoSchema,
      },
    },
  },
};

export const uiSchema = {
  ...titleUI('Information about your marriage'),
  doesLiveWithSpouse: {
    spouseIncome: {
      ...yesNoUI('Did your spouse have income in the last 365 days?'),
      'ui:description': generateHelpText(
        'Answer this question only if you are adding this dependent to your pension.',
      ),
    },
  },
};
