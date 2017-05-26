import _ from 'lodash/fp';
import AdditionalSourcesField from '../components/AdditionalSourcesField';

export function netWorthSchema(schema) {
  const newSchema = _.merge(schema.definitions.netWorth, {
    required: [
      'bank',
      'interestBank',
      'ira',
      'stocks',
      'realProperty',
      'otherProperty'
    ]
  });

  return _.set('properties.additionalSources', {
    type: 'array',
    items: {
      type: 'object',
      required: ['name', 'amount'],
      properties: {
        name: {
          type: 'string'
        },
        amount: {
          type: 'integer'
        }
      }
    }
  }, newSchema);
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
  },
  additionalSources: {
    'ui:field': AdditionalSourcesField,
    items: {
      name: {
        'ui:title': 'Source'
      },
      amount: {
        'ui:title': 'Amount',
        'ui:options': {
          classNames: 'schemaform-currency-input',
        }
      }
    }
  }
};
