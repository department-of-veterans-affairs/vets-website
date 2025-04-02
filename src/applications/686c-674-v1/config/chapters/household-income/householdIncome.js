import environment from 'platform/utilities/environment';
import { netWorthCalculation, netWorthTitle } from './helpers';
import { householdIncome } from '../../utilities';

export const schema = householdIncome;

export const uiSchema = {
  householdIncome: {
    'ui:options': {
      hideIf: () => environment.isProduction(),
      hideOnReview: () => environment.isProduction(),
    },
    'ui:title': netWorthCalculation,
    'ui:description': netWorthTitle,
    'ui:widget': 'yesNo',
  },
};
