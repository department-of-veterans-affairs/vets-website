import ItemLoop from '../components/ItemLoop';
import CardDetailsView from '../components/CardDetailsView';

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
    },
    hasRealEstate: {
      'ui:options': {
        expandUnder: 'realEstate',
      },
      realEstateValue: {
        'ui:field': ItemLoop,
        'ui:options': {
          viewField: CardDetailsView,
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
    rvBoatOrCamper: {
      'ui:title': 'Do you currently own any trailers, boats or campers?',
      'ui:widget': 'yesNo',
    },
    hasRvBoatOrCamper: {
      'ui:options': {
        expandUnder: 'rvBoatOrCamper',
      },
      rvBoatOrCamperValue: {
        'ui:field': ItemLoop,
        'ui:options': {
          viewField: CardDetailsView,
        },
        items: {
          'ui:title': 'Trailers, boats, or campers owned',
          rvBoatOrCamperType: {
            'ui:title': 'Type',
          },
          rvBoatOrCamperValue: {
            'ui:title': 'Resale value',
          },
        },
      },
    },
    automobiles: {
      'ui:title': 'Do you currently own any automobiles?',
      'ui:widget': 'yesNo',
    },
    hasAutomobiles: {
      'ui:options': {
        expandUnder: 'automobiles',
      },
      automobilesValue: {
        'ui:field': ItemLoop,
        'ui:options': {
          viewField: CardDetailsView,
        },
        items: {
          'ui:title': 'Trailers, boats, or campers owned',
          automobileMake: {
            'ui:title': 'Automobile make',
          },
          automobileModel: {
            'ui:title': 'Automobile model',
          },
          automobileYear: {
            'ui:title': 'Automobile year',
          },
          automobileResaleValue: {
            'ui:title': 'Automobile resale value',
          },
        },
      },
    },
    otherAssets: {
      'ui:title': 'Do you own other assets?',
      'ui:widget': 'yesNo',
    },
    hasOtherAssets: {
      'ui:options': {
        expandUnder: 'otherAssets',
      },
      otherAssetsValue: {
        'ui:field': ItemLoop,
        'ui:options': {
          viewField: CardDetailsView,
        },
        items: {
          'ui:title': 'Other assets owned',
          otherAssetType: {
            'ui:title': 'Asset Type',
          },
          otherAssetResaleValue: {
            'ui:title': 'Resale Value',
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
        },
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
        rvBoatOrCamper: {
          type: 'boolean',
        },
        hasRvBoatOrCamper: {
          type: 'object',
          properties: {
            rvBoatOrCamperValue: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  rvBoatOrCamperType: {
                    type: 'string',
                  },
                  rvBoatOrCamperValue: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        automobiles: {
          type: 'boolean',
        },
        hasAutomobiles: {
          type: 'object',
          properties: {
            automobilesValue: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  automobileMake: {
                    type: 'string',
                  },
                  automobileModel: {
                    type: 'string',
                  },
                  automobileYear: {
                    type: 'string',
                  },
                  automobileResaleValue: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        otherAssets: {
          type: 'boolean',
        },
        hasOtherAssets: {
          type: 'object',
          properties: {
            otherAssetsValue: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  otherAssetType: {
                    type: 'string',
                  },
                  otherAssetResaleValue: {
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
};
