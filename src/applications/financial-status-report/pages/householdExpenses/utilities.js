import ItemLoop from '../../components/ItemLoop';
import TableDetailsView from '../../components/TableDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';

export const uiSchema = {
  'ui:title': 'Your monthly utility bills',
  utilities: {
    hasUtility: {
      'ui:title':
        'Do you pay any utility bills, such as electricity, water, or gas?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    utilityRecords: {
      'ui:field': ItemLoop,
      'ui:description':
        'Enter each type of monthly utility bill separately below.',
      'ui:options': {
        expandUnder: 'hasUtility',
        viewType: 'table',
        viewField: TableDetailsView,
        doNotScroll: true,
        showSave: true,
        itemName: 'Add a utility',
      },
      items: {
        utilityType: {
          'ui:title': 'Type of utility',
        },
        monthlyUtilityAmount: currencyUI('Monthly payment amount'),
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    utilities: {
      type: 'object',
      properties: {
        hasUtility: {
          type: 'boolean',
        },
        utilityRecords: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              utilityType: {
                type: 'string',
              },
              monthlyUtilityAmount: {
                type: 'number',
              },
            },
          },
        },
      },
    },
  },
};
