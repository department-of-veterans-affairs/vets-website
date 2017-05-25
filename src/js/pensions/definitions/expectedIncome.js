import _ from 'lodash/fp';

export function expectedIncomeSchema(schema) {
  return _.assign(schema.definitions.expectedIncome, {
    required: [
      'salary',
      'interest',
      'other'
    ]
  });
}

export const expectedIncomeUI = {
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
  }
};
