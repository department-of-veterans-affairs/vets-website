import { netWorthCalculation, netWorthTitle } from './helpers';

export const schema = {
  type: 'object',
  properties: {
    householdIncome: {
      type: 'boolean',
    },
  },
};

export const uiSchema = {
  householdIncome: {
    'ui:title': netWorthCalculation,
    'ui:description': netWorthTitle,
    'ui:widget': 'yesNo',
  },
};
