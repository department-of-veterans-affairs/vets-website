import merge from 'lodash/merge';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';

import { IncomeDescription } from '../../../components/FormDescriptions';
import { validateCurrency } from '../../../utils/validation';
import {
  dependentIncomeUiSchema,
  createDependentIncomeSchema,
} from '../../../definitions/dependent';

const isVeteranMarried = formData =>
  formData.maritalStatus?.toLowerCase() === 'married';

const isVeteranSeparated = formData =>
  formData.maritalStatus?.toLowerCase() === 'separated';

const hasVeteranBeenMarried = formData =>
  isVeteranMarried(formData) || isVeteranSeparated(formData);

const {
  dependents,
  spouseGrossIncome,
  spouseNetIncome,
  spouseOtherIncome,
  veteranGrossIncome,
  veteranNetIncome,
  veteranOtherIncome,
} = fullSchemaHca.properties;

const { items: dependent } = dependents;
const dependentIncomeSchema = createDependentIncomeSchema(dependent);

export default {
  uiSchema: {
    'ui:title': 'Annual income',
    'ui:description': IncomeDescription,
    veteranGrossIncome: set(
      'ui:validations',
      [validateCurrency],
      currencyUI('Veteran\u2019s gross annual income from employment'),
    ),
    veteranNetIncome: set(
      'ui:validations',
      [validateCurrency],
      currencyUI(
        'Veteran\u2019s net income from your farm, ranch, property or business',
      ),
    ),
    veteranOtherIncome: set(
      'ui:validations',
      [validateCurrency],
      currencyUI('Veteran\u2019s other income amount'),
    ),
    'view:spouseIncome': {
      'ui:title': 'Spouse\u2019s income',
      'ui:options': {
        hideIf: formData =>
          !formData.maritalStatus ||
          (!isVeteranMarried(formData) && !isVeteranSeparated(formData)),
      },
      spouseGrossIncome: merge(
        {},
        currencyUI('Spouse\u2019s gross annual income from employment'),
        {
          'ui:required': formData => hasVeteranBeenMarried(formData),
          'ui:validations': [validateCurrency],
        },
      ),
      spouseNetIncome: merge(
        {},
        currencyUI(
          'Spouse\u2019s net income from your farm, ranch, property or business',
        ),
        {
          'ui:required': formData => hasVeteranBeenMarried(formData),
          'ui:validations': [validateCurrency],
        },
      ),
      spouseOtherIncome: merge(
        {},
        currencyUI('Spouse\u2019s other income amount'),
        {
          'ui:required': formData => hasVeteranBeenMarried(formData),
          'ui:validations': [validateCurrency],
        },
      ),
    },
    dependents: {
      'ui:field': 'BasicArrayField',
      items: dependentIncomeUiSchema,
      'ui:options': {
        hideIf: formData => !get('view:reportDependents', formData),
      },
    },
  },
  schema: {
    type: 'object',
    required: ['veteranGrossIncome', 'veteranNetIncome', 'veteranOtherIncome'],
    properties: {
      veteranGrossIncome,
      veteranNetIncome,
      veteranOtherIncome,
      'view:spouseIncome': {
        type: 'object',
        properties: {
          spouseGrossIncome,
          spouseNetIncome,
          spouseOtherIncome,
        },
      },
      dependents: {
        ...dependents,
        items: dependentIncomeSchema,
        minItems: 1,
      },
    },
  },
};
