import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import {
  yesNoUI,
  numberUI,
  numberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CurrencyReviewRowView } from '../../../components/ReviewRowView';
import { generateHelpText, generateTitle } from '../../../utils/helpers';

const { govtContributions } = fullSchemaBurials.properties;

export default {
  uiSchema: {
    'ui:title': generateTitle('Plot or interment allowance'),
    govtContributions: {
      ...yesNoUI({
        title:
          'Did the federal government, state government, or the Veteran’s employer pay any of the burial costs?',
        errorMessages: 'Select yes or no',
      }),
      'ui:options': { classNames: 'vads-u-margin-bottom--2' },
    },
    amountGovtContribution: {
      ...numberUI({
        title: 'Amount the government or employer paid',
        description: generateHelpText(
          'Enter an amount with numbers only. Don\'t include symbols or special characters like "$," commas, or periods.',
          'vads-u-color--gray vads-u-font-size--md vads-u-margin-top--2 vads-u-display--inline-block',
        ),
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
      govtContributions,
      amountGovtContribution: numberSchema,
    },
  },
};
