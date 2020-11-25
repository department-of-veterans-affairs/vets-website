import ItemLoop from '../components/ItemLoop';
import RealEstateView from '../components/RealEstateView';

export const uiSchema = {
  householdAssets: {
    'ui:title': 'Your household assets',
    checkingAndSavings: {
      'ui:title':
        'What is the total amount in your checking and savings account(s)?',
      'ui:required': () => true,
    },
    availableAssets: {
      'ui:title': 'What is the total amount of cash you have available?',
      'ui:required': () => true,
    },
    savingsBonds: {
      'ui:title':
        'What is the total current value of your U.S. Savings Bonds??',
      'ui:required': () => true,
    },
    stocksAndOtherBonds: {
      'ui:title':
        'What is the total current value of your stocks and other bonds?',
      'ui:required': () => true,
    },
    realEstate: {
      'ui:title': 'Do you currently own any real estate?',
      'ui:widget': 'yesNo',
      hasRealEstate: {
        'ui:options': {
          expandUnder: 'realEstate',
        },
        realEstateValue: {
          'ui:field': ItemLoop,
          'ui:options': {
            viewField: RealEstateView,
          },
          items: {
            'ui:title': 'Real estate owned:',
            realEstateType: {
              'ui:title': 'Real estate type',
            },
            realEstateValue: {
              'ui:title': 'Real estate value',
            },
          },
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    householdAssets: {
      type: 'object',
      properties: {
        checkingAndSavings: {
          type: 'string',
        },
        availableAssets: {
          type: 'string',
        },
        savingsBonds: {
          type: 'string',
        },
        stocksAndOtherBonds: {
          type: 'string',
        },
        realEstate: {
          type: 'boolean',
          hasRealEstate: {
            type: 'object',
            properties: {
              realEstateValue: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    realEstateType: {
                      type: 'string',
                    },
                    realEstateValue: {
                      type: 'string',
                    },
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
