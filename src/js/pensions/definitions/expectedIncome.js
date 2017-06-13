import { additionalSourcesUI } from './additionalSources';

export default {
  'ui:order': [
    'salary',
    'interest',
    'other',
    'additionalSources'
  ],
  salary: {
    'ui:title': 'Gross wages and salary',
    'ui:options': {
      classNames: 'schemaform-currency-input'
    }
  },
  interest: {
    'ui:title': 'Total dividends and interest',
    'ui:options': {
      classNames: 'schemaform-currency-input'
    }
  },
  other: {
    'ui:title': 'Other expected income',
    'ui:options': {
      classNames: 'schemaform-currency-input'
    }
  },
  additionalSources: additionalSourcesUI
};
