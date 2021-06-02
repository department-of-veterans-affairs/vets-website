import ItemLoop from '../../../components/ItemLoop';
import CardDetailsView from '../../../components/CardDetailsView';

export const uiSchema = {
  'ui:title': 'Your dependents',
  'ui:description': 'Enter each dependent’s age separately below.',
  personalData: {
    agesOfOtherDependents: {
      'ui:field': ItemLoop,
      'ui:options': {
        viewField: CardDetailsView,
        doNotScroll: true,
        showSave: true,
        itemName: 'a dependent',
        keepInPageOnReview: true,
      },
      items: {
        dependentAge: {
          'ui:title': 'Dependent’s age',
          'ui:options': {
            classNames: 'vads-u-margin-bottom--3 vads-u-margin-top--3',
            widgetClassNames: 'input-size-3',
          },
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    personalData: {
      type: 'object',
      properties: {
        agesOfOtherDependents: {
          type: 'array',
          items: {
            type: 'object',
            required: ['dependentAge'],
            properties: {
              dependentAge: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
};
