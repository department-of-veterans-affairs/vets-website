import ItemLoop from '../../../components/ItemLoop';
import CardDetailsView from '../../../components/CardDetailsView';

export const uiSchema = {
  'ui:title': 'Your dependents',
  dependentRecords: {
    'ui:field': ItemLoop,
    'ui:description': 'Enter each dependent’s age separately below.',
    'ui:options': {
      viewField: CardDetailsView,
      doNotScroll: true,
      showSave: true,
      itemName: 'a dependent',
    },
    items: {
      dependentAge: {
        'ui:title': 'Dependent’s age',
        'ui:options': {
          widgetClassNames: 'input-size-3',
        },
        'ui:required': formData => formData.dependents,
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    dependentRecords: {
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
};
