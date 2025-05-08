import {
  yesNoUI,
  yesNoSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Transportation allowance'),
    transportationExpenses: yesNoUI(
      'Are you responsible for the transportation of the Veteran’s remains to the final resting place?',
    ),
  },
  schema: {
    type: 'object',
    required: ['transportationExpenses'],
    properties: {
      transportationExpenses: yesNoSchema,
    },
  },
};
