import React from 'react';
import {
  titleUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { whatAreAssets, netWorthTitle, netWorthDescription } from './helpers';
import { NetWorthFooter } from '../../../components/PensionContent';

// Radio option values
const HOUSEHOLD_INCOME_YES = 'Y';
const HOUSEHOLD_INCOME_NO = 'N';
const HOUSEHOLD_INCOME_NOT_APPLICABLE = '';

export const schema = {
  type: 'object',
  properties: {
    'view:householdIncome': radioSchema([
      HOUSEHOLD_INCOME_YES,
      HOUSEHOLD_INCOME_NO,
      HOUSEHOLD_INCOME_NOT_APPLICABLE,
    ]),
    'view:householdIncomeFooter': {
      type: 'object',
      properties: {},
    },
  },
};

// Labels for radio options
const getLabels = featureFlagOn => {
  const baseLabels = {
    [HOUSEHOLD_INCOME_YES]: 'Yes',
    [HOUSEHOLD_INCOME_NO]: 'No',
  };

  // Only show "doesn’t apply" option when feature flag is OFF
  if (!featureFlagOn) {
    baseLabels[HOUSEHOLD_INCOME_NOT_APPLICABLE] =
      'This question doesn’t apply to me';
  }

  return baseLabels;
};

// Descriptions for radio options (only for the third option)
const getDescriptions = featureFlagOn => {
  if (!featureFlagOn) {
    return {
      [HOUSEHOLD_INCOME_NOT_APPLICABLE]:
        'Select this option if you receive VA disability or DIC benefits',
    };
  }
  return {};
};

export const uiSchema = {
  ...titleUI('Your net worth'),
  'ui:description': formData => (
    <>
      <p>{netWorthDescription(formData?.vaDependentsNetWorthAndPension)}</p>
      {whatAreAssets}
    </>
  ),
  'ui:options': {
    updateSchema: (formData, formSchema) => {
      // Use 'view:householdIncome' as UI value and householdIncome as RBPS value
      // Map string values to boolean for RBPS: 'Y' -> false, 'N' -> true, '' -> undefined

      const updated = formData;
      const viewValue = formData['view:householdIncome'];

      // If view:householdIncome is defined, set householdIncome based on selection
      if (viewValue !== undefined) {
        if (viewValue === HOUSEHOLD_INCOME_YES) {
          updated.householdIncome = false;
        } else if (viewValue === HOUSEHOLD_INCOME_NO) {
          updated.householdIncome = true;
        } else if (viewValue === HOUSEHOLD_INCOME_NOT_APPLICABLE) {
          // Empty value - don't set householdIncome (pass nothing)
          delete updated.householdIncome;
        }
      }

      // If householdIncome is defined but view:householdIncome is undefined
      // (user hasn't seen the question yet but in-progress form exists),
      // set view:householdIncome based on householdIncome value
      if (viewValue === undefined && formData.householdIncome !== undefined) {
        updated['view:householdIncome'] = formData.householdIncome
          ? HOUSEHOLD_INCOME_NO
          : HOUSEHOLD_INCOME_YES;
      }

      // Update enum based on feature flag
      const featureFlagOn = formData?.vaDependentsNetWorthAndPension;
      const enumValues = featureFlagOn
        ? [HOUSEHOLD_INCOME_YES, HOUSEHOLD_INCOME_NO]
        : [
            HOUSEHOLD_INCOME_YES,
            HOUSEHOLD_INCOME_NO,
            HOUSEHOLD_INCOME_NOT_APPLICABLE,
          ];

      return {
        ...formSchema,
        properties: {
          ...formSchema.properties,
          'view:householdIncome': {
            type: 'string',
            enum: enumValues,
          },
        },
      };
    },
  },
  'view:householdIncome': radioUI({
    tile: true,
    title: netWorthTitle(),
    labels: getLabels(false),
    descriptions: getDescriptions(false),
    enableAnalytics: true,
    updateUiSchema: formData => {
      const featureFlagOn = formData?.vaDependentsNetWorthAndPension;
      return {
        'ui:title': netWorthTitle({
          netWorthLimit: formData?.netWorthLimit,
          featureFlag: featureFlagOn,
        }),
        'ui:options': {
          labels: getLabels(featureFlagOn),
          descriptions: getDescriptions(featureFlagOn),
        },
      };
    },
  }),
  'view:householdIncomeFooter': {
    'ui:description': NetWorthFooter,
  },
};
