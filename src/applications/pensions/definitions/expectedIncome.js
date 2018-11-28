import { additionalSourcesUI } from './additionalSources';
import currencyUI from 'us-forms-system/lib/js/definitions/currency';

export default {
  'ui:order': ['salary', 'interest', 'additionalSources'],
  salary: currencyUI('Gross wages and salary'),
  interest: currencyUI('Total dividends and interest'),
  additionalSources: additionalSourcesUI,
};
