import {
  radioUI,
  radioSchema,
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  childTypeEnums,
  childTypeLabels,
  DependentRelationshipH3,
  relationshipEnums,
  relationshipLabels,
} from './helpers';

export const schema = {
  type: 'object',
  properties: {
    deaths: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        properties: {
          dependentType: radioSchema(relationshipEnums),
          childStatus: checkboxGroupSchema(childTypeEnums),
        },
      },
    },
  },
};

export const uiSchema = {
  deaths: {
    items: {
      'ui:title': DependentRelationshipH3,
      dependentType: radioUI({
        title: 'What was your relationship to the dependent?',
        required: () => true,
        labels: relationshipLabels,
      }),
      childStatus: {
        ...checkboxGroupUI({
          title: 'What type of child?',
          required: formData => formData?.dependentType === 'child',
          labels: childTypeLabels,
        }),
        'ui:required': (formData, index) =>
          formData?.deaths[index]?.dependentType === 'child',
        'ui:options': {
          expandUnder: 'dependentType',
          expandUnderCondition: 'child',
        },
      },
    },
  },
};
