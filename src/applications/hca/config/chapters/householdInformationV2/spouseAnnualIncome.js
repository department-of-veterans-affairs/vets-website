import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import CustomReviewField from '../../../components/FormReview/CustomReviewField';
import {
  GrossIncomeDescription,
  NetIncomeDescription,
  OtherIncomeDescription,
} from '../../../components/FormDescriptions';

const {
  spouseGrossIncome,
  spouseNetIncome,
  spouseOtherIncome,
} = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:title': 'Spouse\u2019s Annual income',
    spouseGrossIncome: {
      ...currencyUI('Spouse\u2019s gross annual income from employment'),
      'ui:description': GrossIncomeDescription,
      'ui:reviewField': CustomReviewField,
    },
    spouseNetIncome: {
      ...currencyUI(
        'Spouse\u2019s net income from your farm, ranch, property or business',
      ),
      'ui:description': NetIncomeDescription,
      'ui:reviewField': CustomReviewField,
    },
    spouseOtherIncome: {
      ...currencyUI('Spouse\u2019s other income'),
      'ui:description': OtherIncomeDescription,
      'ui:reviewField': CustomReviewField,
    },
  },
  schema: {
    type: 'object',
    required: ['spouseGrossIncome', 'spouseNetIncome', 'spouseOtherIncome'],
    properties: {
      spouseGrossIncome,
      spouseNetIncome,
      spouseOtherIncome,
    },
  },
};
