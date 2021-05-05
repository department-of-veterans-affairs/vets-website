import ItemLoop from '../../../../components/ItemLoop';
import TableDetailsView from '../../../../components/TableDetailsView';
import CustomReviewField from '../../../../components/CustomReviewField';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import Typeahead from '../../../../components/Typeahead';
import {
  formatOptions,
  incomeTypes,
} from '../../../../constants/typeaheadOptions';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Your spouse information',
  additionalIncome: {
    spouse: {
      spouseAdditionalIncomeRecords: {
        'ui:field': ItemLoop,
        'ui:description':
          'Tell us how much you get each month for each type of income.',
        'ui:options': {
          viewType: 'table',
          viewField: TableDetailsView,
          doNotScroll: true,
          showSave: true,
          itemName: 'income',
          keepInPageOnReview: true,
        },
        items: {
          'ui:options': {
            classNames: 'horizontal-field-container no-wrap',
          },
          name: {
            'ui:title': 'Type of income',
            'ui:field': Typeahead,
            'ui:reviewField': CustomReviewField,
            'ui:options': {
              idPrefix: 'spouse_other_income',
              classNames: 'input-size-4',
              getOptions: () => formatOptions(incomeTypes),
            },
          },
          amount: _.merge(currencyUI('Monthly amount'), {
            'ui:options': {
              widgetClassNames: 'input-size-2',
            },
          }),
        },
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    additionalIncome: {
      type: 'object',
      properties: {
        spouse: {
          type: 'object',
          properties: {
            spouseAdditionalIncomeRecords: {
              type: 'array',
              items: {
                type: 'object',
                required: ['name', 'amount'],
                properties: {
                  name: {
                    type: 'string',
                  },
                  amount: {
                    type: 'number',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
