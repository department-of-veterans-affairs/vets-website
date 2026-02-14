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
    'ui:options': {
      tile: true,
      labelHeaderLevel: '3',
      enableAnalytics: true,
      updateSchema: (formData, schema) => {
        /**
         * NAVIGATION FLAGS (not submission flags)
         *
         * This sets view:selectable686Options based on what the user SELECTED
         * in the wizard, not on what data they've COMPLETED. These flags are used
         * for:
         * 1. Page visibility (depends functions check these flags)
         * 2. Field validation during form editing
         *
         * IMPORTANT: These flags may not match the final submission!
         * - User might select an option but not complete the data entry
         * - On submission, buildSubmissionData() rebuilds these flags based on
         *   actual data presence (single source of truth)
         * - Backend receives only flags for completed workflows with data
         *
         * This separation allows users to navigate the form freely while ensuring
         * we only submit flags for workflows they actually completed.
         */
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
