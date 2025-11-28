import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Transportation reimbursement'),
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
