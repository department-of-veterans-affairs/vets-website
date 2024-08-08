import merge from 'lodash/merge';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { isSeparated } from './helpers';

const { currentSpouseMonthlySupport } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  title: 'Financial support for your spouse',
  path: 'household/marital-status/separated/spouse-monthly-support',
  depends: isSeparated,
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
      currentSpouseMonthlySupport,
    },
  },
};
