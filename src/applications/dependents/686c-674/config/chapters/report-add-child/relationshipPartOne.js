import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const relationshipPartOne = {
  uiSchema: {
    ...titleUI({
      title: 'Your relationship to this child',
    }),
    isBiologicalChild: yesNoUI({
      title: 'Is this child your biological child?',
      required: () => true,
      errorMessages: {
        required: 'Select Yes or No.',
      },
    }),
    'ui:options': {
      // Leaving all params as working example
      updateSchema: (formData, schema, _uiSchema, index) => {
        const itemData = formData?.dependents?.[index] || formData;

        if (itemData?.isBiologicalChild === false) {
          itemData.relationshipToChild = undefined;
          itemData.biologicalParentDob = undefined;
          itemData.biologicalParentName = undefined;
          itemData.biologicalParentSsn = undefined;
          itemData.isBiologicalChildOfSpouse = undefined;
          itemData.dateEnteredHousehold = undefined;
        }

        return schema;
      },
    },
  },
  schema: {
    type: 'object',
    required: ['isBiologicalChild'],
    properties: {
      isBiologicalChild: yesNoSchema,
    },
  },
};
