import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { TASK_KEYS } from '../../../constants';
import { addDependentOptions } from './helpers';

export const uiSchema = {
  'view:selectable686Options': checkboxGroupUI({
    title:
      'Who do you want to add as a dependent? Check everyone you want to add.',
    required: form => form?.['view:addOrRemoveDependents']?.remove,
    tile: true,
    labelHeaderLevel: '3',
    labels: {
      addSpouse: addDependentOptions.addSpouse,
      addChild: addDependentOptions.addChild,
      report674: addDependentOptions.report674,
      addDisabledChild: addDependentOptions.addDisabledChild,
    },
    errorMessages: {
      required: 'Select at least one option',
    },
  }),
};

export const schema = {
  type: 'object',
  properties: {
    'view:selectable686Options': checkboxGroupSchema([
      TASK_KEYS.addSpouse,
      TASK_KEYS.addChild,
      TASK_KEYS.report674,
      TASK_KEYS.addDisabledChild,
    ]),
  },
};
