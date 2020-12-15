import ItemLoop from '../../components/ItemLoop';
import TableDetailsView from '../../components/TableDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';

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
      itemName: 'Add an asset',
    },
    items: {
      otherAssetType: {
        'ui:title': 'Type of asset',
      },
      otherAssetAmount: currencyUI('Estimated value'),
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
