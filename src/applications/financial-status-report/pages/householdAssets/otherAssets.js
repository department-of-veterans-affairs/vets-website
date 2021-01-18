import ItemLoop from '../../components/ItemLoop';
import TableDetailsView from '../../components/TableDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Your real estate assets',
  hasOtherAssets: {
    'ui:title': 'Do you currently own other assets?',
    'ui:widget': 'yesNo',
    'ui:required': () => true,
  },
  otherAssetRecords: {
    'ui:field': ItemLoop,
    'ui:description': 'Enter each additional asset separately below.',
    'ui:options': {
      expandUnder: 'hasOtherAssets',
      viewType: 'table',
      viewField: TableDetailsView,
      doNotScroll: true,
      showSave: true,
      itemName: 'asset',
    },
    items: {
      otherAssetType: {
        'ui:title': 'Type of asset',
        'ui:options': {
          widgetClassNames: 'input-size-3',
        },
        'ui:required': formData => formData.hasOtherAssets,
      },
      otherAssetAmount: _.merge(currencyUI('Estimated value'), {
        'ui:options': {
          widgetClassNames: 'input-size-1',
        },
        'ui:required': formData => formData.hasOtherAssets,
      }),
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    hasOtherAssets: {
      type: 'boolean',
    },
    otherAssetRecords: {
      type: 'array',
      items: {
        type: 'object',
        required: ['otherAssetType', 'otherAssetAmount'],
        properties: {
          otherAssetType: {
            type: 'string',
          },
          otherAssetAmount: {
            type: 'number',
          },
        },
      },
    },
  },
};
