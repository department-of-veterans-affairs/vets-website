import ItemLoop from '../../components/ItemLoop';
import TableDetailsView from '../../components/TableDetailsView';

export const uiSchema = {
  'ui:title': 'Your real estate assets',
  hasOtherAssets: {
    'ui:title': 'Do you currently own other assets?',
    'ui:widget': 'yesNo',
    'ui:required': () => true,
  },
  otherAssetRecords: {
    'ui:options': {
      expandUnder: 'hasOtherAssets',
      viewType: 'table',
      viewField: TableDetailsView,
      doNotScroll: true,
      showSave: true,
    },
    'ui:field': ItemLoop,
    'ui:description': 'Enter each additional asset separately below.',
    items: {
      'ui:title': 'Add an asset',
      otherAssetType: {
        'ui:title': 'Type of asset',
      },
      otherAssetAmount: {
        'ui:title': 'Estimated value',
      },
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
