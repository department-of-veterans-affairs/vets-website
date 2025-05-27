import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { TASK_KEYS } from '../../../constants';
import { removeDependentOptions } from './helpers';

export const uiSchema = {
  'view:removeDependentOptions': {
    ...checkboxGroupUI({
      title:
        'Who do you want to remove as a dependent? Check everyone you want to remove.',
      required: () => true,
      tile: true,
      labelHeaderLevel: '3',
      labels: {
        reportDivorce: removeDependentOptions.reportDivorce,
        reportDeath: removeDependentOptions.reportDeath,
        reportStepchildNotInHousehold:
          removeDependentOptions.reportStepchildNotInHousehold,
        reportMarriageOfChildUnder18:
          removeDependentOptions.reportMarriageOfChildUnder18,
        reportChild18OrOlderIsNotAttendingSchool:
          removeDependentOptions.reportChild18OrOlderIsNotAttendingSchool,
      },
      enableAnalytics: true,
      errorMessages: {
        required: 'Select at least one option',
      },
    }),
    'ui:options': {
      tile: true,
      updateSchema: (formData, schema) => {
        // Check if new option is selected
        // update view:selectable686Options with the selection
        // this is to preserve field validation

        if (formData?.['view:removeDependentOptions']) {
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
};

export const schema = {
  type: 'object',
  required: ['view:removeDependentOptions'],
  properties: {
    'view:removeDependentOptions': checkboxGroupSchema([
      TASK_KEYS.reportDivorce,
      TASK_KEYS.reportDeath,
      TASK_KEYS.reportStepchildNotInHousehold,
      TASK_KEYS.reportMarriageOfChildUnder18,
      TASK_KEYS.reportChild18OrOlderIsNotAttendingSchool,
    ]),
  },
};
