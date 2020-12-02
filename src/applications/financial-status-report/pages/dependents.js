import ItemLoop from '../components/ItemLoop';
import DependentView from '../components/DependentView';

export const uiSchema = {
  'ui:title': 'Your employment history',
  dependentsSection: {
    dependents: {
      'ui:title': 'Do you have any dependents?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    hasDependents: {
      'ui:options': {
        expandUnder: 'dependents',
      },
      dependentAge: {
        'ui:title': 'Dependent Age',
        'ui:field': ItemLoop,
        'ui:options': {
          viewField: DependentView,
        },
        items: {
          'ui:title': 'Age in years:',
        },
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    dependentsSection: {
      type: 'object',
      properties: {
        dependents: {
          type: 'boolean',
        },
        hasDependents: {
          type: 'object',
          properties: {
            dependentAge: {
              type: 'array',
              minItems: 0,
              items: {
                type: 'number',
                minimum: 0,
                minValue: '0',
                exclusiveMinimum: 0,
              },
            },
          },
        },
      },
    },
  },
};
