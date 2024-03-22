import merge from 'lodash/merge';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Financial support for your spouse'),
    currentSpouseMonthlySupport: merge(
      {},
      currencyUI(
        'How much do you contribute each month to your spouse’s support?',
      ),
      {
        'ui:options': {
          classNames: 'schemaform-currency-input-v3',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    required: ['currentSpouseMonthlySupport'],
    properties: {
      currentSpouseMonthlySupport: { type: 'number' },
    },
  },
};
