import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';

import { validateCurrency } from '../../../utils/validation';
import {
  GrossIncomeDescription,
  NetIncomeDescription,
  OtherIncomeDescription,
} from '../../../components/FormDescriptions';

const {
  veteranGrossIncome,
  veteranNetIncome,
  veteranOtherIncome,
} = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:title': 'Your Annual income',
    veteranGrossIncome: {
      ...currencyUI('Gross annual income from employment'),
      'ui:description': GrossIncomeDescription,
      'ui:validations': [validateCurrency],
    },
    veteranNetIncome: {
      ...currencyUI('Net income from your farm, ranch, property or business'),
      'ui:description': NetIncomeDescription,
      'ui:validations': [validateCurrency],
    },
    veteranOtherIncome: {
      ...currencyUI('Other income'),
      'ui:description': OtherIncomeDescription,
      'ui:validations': [validateCurrency],
    },
  },
  schema: {
    type: 'object',
    required: ['veteranGrossIncome', 'veteranNetIncome', 'veteranOtherIncome'],
    properties: {
      veteranGrossIncome,
      veteranNetIncome,
      veteranOtherIncome,
    },
  },
};
