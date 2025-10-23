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
      updateSchema: (formData, schema, _uiSchema, index) => {
        const itemData = formData?.childrenToAdd?.[index] || formData;

        if (itemData?.isBiologicalChild === true) {
          [
            'relationshipToChild',
            'biologicalParentDob',
            'biologicalParentName',
            'biologicalParentSsn',
            'isBiologicalChildOfSpouse',
            'dateEnteredHousehold',
          ].forEach(field => {
            itemData[field] = undefined;
          });
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
