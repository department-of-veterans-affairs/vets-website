import _ from 'lodash/fp';

export function netWorthSchema(schema) {
  return _.assign(schema.definitions.netWorth, {
    required: [
      'bank',
      'interestBank',
      'ira',
      'stocks',
      'realProperty',
      'otherProperty'
    ]
  });
}

export const netWorthUI = {
  'ui:order': [
    'bank',
    'interestBank',
    'ira',
    'stocks',
    'realProperty',
    'otherProperty',
    'additionalSources'
  ],
  bank: {
    'ui:title': 'Cash/Non-interest bearing accounts',
    'ui:options': {
      classNames: 'schemaform-currency-input'
    }
  },
  interestBank: {
    'ui:title': 'Interest bearing accounts',
    'ui:options': {
      classNames: 'schemaform-currency-input'
    }
  },
  ira: {
    'ui:title': 'IRAs, KEOGH Plans, etc.',
    'ui:options': {
      classNames: 'schemaform-currency-input'
    }
  },
  stocks: {
    'ui:title': 'Stocks, bonds, mutual funds, etc',
    'ui:options': {
      classNames: 'schemaform-currency-input'
    }
  },
  realProperty: {
    'ui:title': 'Real Property (not your home, vehicle, furniture, or clothing)',
    'ui:options': {
      classNames: 'schemaform-currency-input'
    }
  },
  otherProperty: {
    'ui:title': 'Other',
    'ui:options': {
      classNames: 'schemaform-currency-input',
    }
  }
};
