import {
  yesNoUI,
  yesNoSchema,
  numberUI,
  numberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CurrencyReviewRowView } from '../../../components/ReviewRowView';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Plot or interment allowance'),
    govtContributions: yesNoUI(
      'Did the federal government, state government, or the Veteran’s employer pay any of the burial costs?',
    ),
    amountGovtContribution: {
      ...numberUI({
        title: 'Amount the government or employer paid',
        hint:
          'Enter an amount with numbers only. Don\'t include symbols or special characters like "$," commas, or periods.',
        hideIf: form => !form?.govtContributions,
        errorMessages: {
          pattern:
            'You entered a character we can\'t accept. Remove symbols or special characters like "$," commas, or periods.',
        },
        min: 0,
      }),
      'ui:required': form => form?.govtContributions,
      'ui:reviewField': CurrencyReviewRowView,
    },
  },
  schema: {
    type: 'object',
    required: ['govtContributions'],
    properties: {
      govtContributions: yesNoSchema,
      amountGovtContribution: numberSchema,
    },
  },
};
