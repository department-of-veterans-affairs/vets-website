import {
  yesNoUI,
  yesNoSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Burial allowance'),
    previouslyReceivedAllowance: yesNoUI({
      title: 'Did you previously receive a VA burial allowance?',
      classNames: 'vads-u-margin-top--0',
      hideIf: form => form?.relationshipToVeteran !== 'spouse',
    }),
    burialExpenseResponsibility: yesNoUI({
      title: 'Are you responsible for the Veteran’s burial expenses?',
      classNames: 'vads-u-margin-bottom--2',
    }),
  },
  schema: {
    type: 'object',
    required: ['previouslyReceivedAllowance', 'burialExpenseResponsibility'],
    properties: {
      previouslyReceivedAllowance: yesNoSchema,
      burialExpenseResponsibility: yesNoSchema,
    },
  },
};
