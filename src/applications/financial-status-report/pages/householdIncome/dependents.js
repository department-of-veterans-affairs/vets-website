import ItemLoop from '../../components/ItemLoop';
import CardDetailsView from '../../components/CardDetailsView';

export const uiSchema = {
  'ui:title': 'Your dependents',
  dependents: {
    'ui:title': 'Do you have any dependents?',
    'ui:widget': 'yesNo',
    'ui:required': () => true,
  },
  dependentRecords: {
    'ui:field': ItemLoop,
    'ui:description': 'Enter the age of your dependent(s) separately below.',
    'ui:options': {
      expandUnder: 'dependents',
      viewField: CardDetailsView,
      doNotScroll: true,
      showSave: true,
      itemName: 'Add a dependent',
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
    dependents: {
      type: 'boolean',
    },
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
