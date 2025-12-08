import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const uiSchema = {
  'view:addOrRemoveDependents': {
    ...checkboxGroupUI({
      title: 'What would you like to do?',
      hint: 'Select all that apply.',
      required: true,
      labelHeaderLevel: '3',
      tile: true,
      labels: {
        add: 'Add one or more dependents',
        remove: 'Remove one or more dependents',
      },
      enableAnalytics: true,
      errorMessages: {
        required: 'Select at least one option',
      },
    }),
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:addOrRemoveDependents': checkboxGroupSchema(['remove', 'add']),
  },
};
