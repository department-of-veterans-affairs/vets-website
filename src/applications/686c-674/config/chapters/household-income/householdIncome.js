import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { whatAreAssets, netWorthTitle } from './helpers';

export const schema = {
  type: 'object',
  properties: {
    householdIncome: yesNoSchema,
  },
};

export const uiSchema = {
  ...titleUI(
    'Your net worth',
    'If you currently receive VA pension benefits, we need to know your net worth. Your net worth includes your assets and your annual income. If you’re married, include the value of your spouse’s assets and annual income too.',
  ),
  'ui:description': whatAreAssets,
  householdIncome: yesNoUI(netWorthTitle),
};
