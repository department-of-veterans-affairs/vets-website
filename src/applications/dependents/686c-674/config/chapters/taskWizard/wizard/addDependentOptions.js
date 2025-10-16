import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { TASK_KEYS } from '../../../constants';
import { addDependentOptions } from './helpers';
import { AddDependentsOptionsDescription } from '../../../../components/AddDependentsOptionsDescription';

export const uiSchema = {
  'view:addDependentOptions': {
    ...checkboxGroupUI({
      title: 'Who do you want to add as a dependent?',
      description: 'Select all that apply.',
      required: () => true,
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
    'ui:options': {
      tile: true,
      labelHeaderLevel: '3',
      enableAnalytics: true,
      updateSchema: (formData, schema) => {
        // Check if new option is selected
        // update view:selectable686Options with the selection
        // this is to preserve field validation

        if (formData?.['view:addDependentOptions']) {
          // eslint-disable-next-line no-param-reassign
          formData['view:selectable686Options'] = {
            ...formData?.['view:addDependentOptions'],
            ...formData?.['view:removeDependentOptions'],
          };
        }

        return schema;
      },
    },
  },
  'view:addDependentOptionsDescription': {
    'ui:description': AddDependentsOptionsDescription,
  },
};

export const schema = {
  type: 'object',
  required: ['view:addDependentOptions'],
  properties: {
    'view:addDependentOptions': checkboxGroupSchema([
      TASK_KEYS.addSpouse,
      TASK_KEYS.addChild,
      TASK_KEYS.report674,
      TASK_KEYS.addDisabledChild,
    ]),
    'view:addDependentOptionsDescription': {
      type: 'object',
      properties: {},
    },
  },
};
