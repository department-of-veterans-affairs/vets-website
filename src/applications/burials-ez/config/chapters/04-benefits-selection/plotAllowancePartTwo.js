import {
  yesNoUI,
  yesNoSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Plot or interment allowance'),
    plotExpenseResponsibility: yesNoUI(
      'Are you responsible for the Veteran’s plot or interment expenses?',
    ),
  },
  schema: {
    type: 'object',
    required: ['plotExpenseResponsibility'],
    properties: {
      plotExpenseResponsibility: yesNoSchema,
    },
  },
};
