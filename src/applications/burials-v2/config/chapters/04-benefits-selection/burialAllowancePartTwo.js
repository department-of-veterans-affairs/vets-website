import {
  yesNoUI,
  yesNoSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Burial allowance'),
    previouslyReceivedAllowance: {
      ...yesNoUI({
        title: 'Did you previously receive a VA burial allowance?',
        hideIf: form => form?.relationshipToVeteran !== 'spouse',
      }),
      'ui:required': form => form?.relationshipToVeteran,
      'ui:options:': {
        classNames: 'vads-u-margin-top--0',
      },
    },
    burialExpenseResponsibility: yesNoUI({
      title: 'Are you responsible for the Veteran’s burial expenses?',
      classNames: 'vads-u-margin-bottom--2',
    }),
  },
  schema: {
    type: 'object',
    required: ['burialExpenseResponsibility'],
    properties: {
      previouslyReceivedAllowance: yesNoSchema,
      burialExpenseResponsibility: yesNoSchema,
    },
  },
};
