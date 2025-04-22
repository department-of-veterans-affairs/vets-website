import {
  titleUI,
  currencyUI,
  currencySchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isSeparated } from './helpers';

/** @type {PageSchema} */
export default {
  title: 'Financial support for your spouse',
  path: 'household/marital-status/separated/spouse-monthly-support',
  depends: isSeparated,
  uiSchema: {
    ...titleUI('Financial support for your spouse'),
    currentSpouseMonthlySupport: currencyUI(
      'How much do you contribute each month to your spouse’s support?',
    ),
  },
  schema: {
    type: 'object',
    required: ['currentSpouseMonthlySupport'],
    properties: {
      currentSpouseMonthlySupport: currencySchema,
    },
  },
};
