import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Burial allowance'),
    previouslyReceivedAllowance: {
      ...yesNoUI({
        title: 'Did you previously receive a VA burial allowance?',
        hideIf: form => form?.relationshipToVeteran !== 'spouse',
      }),
      'ui:required': form => form?.relationshipToVeteran === 'spouse',
      'ui:options:': {
        classNames: 'vads-u-margin-top--0',
      },
    },
    burialExpenseResponsibility: {
      ...yesNoUI({
        title: 'Are you responsible for the Veteran’s burial expenses?',
      }),
      'ui:options': {
        classNames: 'vads-u-margin-bottom--2',
      },
    },
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
