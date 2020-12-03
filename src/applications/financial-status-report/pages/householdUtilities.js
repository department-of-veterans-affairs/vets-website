import ItemLoop from '../components/ItemLoop';
import CardDetailsView from '../components/CardDetailsView';

export const uiSchema = {
  'ui:title': 'Your monthly utility bills',
  householdUtilities: {
    utilities: {
      'ui:title':
        'Do you pay any utility bills, such as electricity, water, or gas?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    hasUtilities: {
      'ui:options': {
        expandUnder: 'utilities',
      },
      utilityType: {
        'ui:field': ItemLoop,
        'ui:description':
          'Enter each type of monthly utility bill separately below.',
        'ui:options': {
          viewField: CardDetailsView,
          doNotScroll: true,
          showSave: true,
        },
        items: {
          'ui:title': 'Add a utility',
          utilityType: {
            'ui:title': 'Type of utility',
          },
          monthlyUtilityAmount: {
            'ui:title': 'Monthly payment amount',
          },
        },
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    householdUtilities: {
      type: 'object',
      properties: {
        utilities: {
          type: 'boolean',
        },
        hasUtilities: {
          type: 'object',
          properties: {
            utilityType: {
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
    },
  },
};
