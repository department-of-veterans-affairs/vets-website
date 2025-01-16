import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { TASK_KEYS } from '../../../constants';
import { removeDependentOptions } from './helpers';

export const uiSchema = {
  'view:selectable686Options': checkboxGroupUI({
    title:
      'Who do you want to remove as a dependent? Check everyone you want to remove.',
    required: form => form?.['view:addOrRemoveDependents']?.remove,
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
    errorMessages: {
      required: 'Select at least one option',
    },
  }),
};

export const schema = {
  type: 'object',
  properties: {
    'view:selectable686Options': checkboxGroupSchema([
      TASK_KEYS.reportDivorce,
      TASK_KEYS.reportDeath,
      TASK_KEYS.reportStepchildNotInHousehold,
      TASK_KEYS.reportMarriageOfChildUnder18,
      TASK_KEYS.reportChild18OrOlderIsNotAttendingSchool,
    ]),
  },
};
