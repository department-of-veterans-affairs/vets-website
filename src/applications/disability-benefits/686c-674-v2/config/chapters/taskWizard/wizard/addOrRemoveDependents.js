import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const uiSchema = {
  'view:addOrRemoveDependents': checkboxGroupUI({
    title: 'What would you like to do? Check everything that you want to do.',
    required: true,
    labelHeaderLevel: '3',
    tile: true,
    labels: {
      add: 'Add one or more dependents',
      remove: 'Remove one or more dependents',
    },
    errorMessages: {
      required: 'Select at least one option',
    },
  }),
};

export const schema = {
  type: 'object',
  properties: {
    'view:addOrRemoveDependents': checkboxGroupSchema(['add', 'remove']),
  },
};
