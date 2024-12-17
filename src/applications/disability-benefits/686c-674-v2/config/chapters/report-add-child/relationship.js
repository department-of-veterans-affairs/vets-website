import {
  titleUI,
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';

export const relationship = {
  uiSchema: {
    ...titleUI({
      title: 'Your relationship to this child',
    }),
    relationshipToChild: checkboxGroupUI({
      title: 'What’s your relationship to this child',
      'ui:description': 'Check all that apply',
      'ui:webComponentField': VaCheckboxField,
      labels: {
        biological: 'They’re my biological child',
        adopted: 'They’re my adopted child',
        stepchild: 'They’re my stepchild',
      },
      required: () => true,
      errorMessages: {
        required: 'Select at least one relationship.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      relationshipToChild: checkboxGroupSchema([
        'biological',
        'adopted',
        'stepchild',
      ]),
    },
  },
};
