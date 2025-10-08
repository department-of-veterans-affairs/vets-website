import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { whatAreAssets, netWorthTitle } from './helpers';

export const schema = {
  type: 'object',
  properties: {
    'view:householdIncome': yesNoSchema,
  },
};

export const uiSchema = {
  ...titleUI(
    'Your net worth',
    'If you currently receive VA pension benefits, we need to know your net worth. Your net worth includes your assets and your annual income. If you’re married, include the value of your spouse’s assets and annual income too.',
  ),
  'ui:description': whatAreAssets,
  'ui:options': {
    updateSchema: (formData, formSchema) => {
      // Use 'view:householdIncome' as UI value and householdIncome as RBPS value
      // Set householdIncome to the opposite of view:householdIncome (as per RBPS)

      const updated = formData;
      // If view:householdIncome is undefined (user hasn't seen the question yet), leave householdIncome alone
      // If view:householdIncome is defined, set householdIncome to the opposite value
      // If householdIncome is defined but view:householdIncome is undefined (user hasn't seen the question yet but in-progress form exists),
      // set view:householdIncome to the opposite value of householdIncome
      if (formData['view:householdIncome'] !== undefined) {
        updated.householdIncome = !formData['view:householdIncome'];
      }
      if (
        formData['view:householdIncome'] === undefined &&
        formData.householdIncome !== undefined
      ) {
        updated['view:householdIncome'] = !formData.householdIncome;
      }

      return formSchema;
    },
  },
  'view:householdIncome': yesNoUI({
    title: netWorthTitle(),
    enableAnalytics: true,
    updateUiSchema: formData => ({
      'ui:title': netWorthTitle({
        netWorthLimit: formData?.netWorthLimit,
        featureFlag: formData?.vaDependentsNetWorthAndPension,
      }),
    }),
  }),
};
