import { netWorthCalculation, netWorthTitle } from './helpers';
import { householdIncome } from '../../utilities';

export const schema = householdIncome;

export const uiSchema = {
  householdIncome: {
    'ui:title': netWorthCalculation,
    'ui:description': netWorthTitle,
    'ui:widget': 'yesNo',
  },
};
