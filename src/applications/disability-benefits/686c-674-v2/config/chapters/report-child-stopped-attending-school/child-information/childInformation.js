import merge from 'lodash/merge';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import environment from 'platform/utilities/environment';
import { TASK_KEYS } from '../../../constants';
import {
  isChapterFieldRequired,
  PensionIncomeRemovalQuestionTitle,
} from '../../../helpers';
import {
  validateName,
  reportChildStoppedAttendingSchool,
} from '../../../utilities';

export const schema = {
  type: 'object',
  properties: {
    childStoppedAttendingSchool: reportChildStoppedAttendingSchool,
  },
};

export const uiSchema = {
  childStoppedAttendingSchool: {
    fullName: {
      'ui:validations': [validateName],
      first: {
        'ui:required': formData =>
          isChapterFieldRequired(
            formData,
            TASK_KEYS.reportChild18OrOlderIsNotAttendingSchool,
          ),
        'ui:title': 'First name',
        'ui:errorMessages': {
          required: 'Enter a first name',
          pattern: 'This field accepts alphabetic characters only',
        },
      },
      middle: {
        'ui:title': 'Middle name',
        'ui:options': {
          hideEmptyValueInReview: true,
        },
        'ui:errorMessages': {
          pattern: 'This field accepts alphabetic characters only',
        },
      },
      last: {
        'ui:required': formData =>
          isChapterFieldRequired(
            formData,
            TASK_KEYS.reportChild18OrOlderIsNotAttendingSchool,
          ),
        'ui:title': 'Last name',
        'ui:errorMessages': {
          required: 'Enter a last name',
          pattern: 'This field accepts alphabetic characters only',
        },
      },
      suffix: {
        'ui:title': 'Suffix',
        'ui:options': {
          widgetClassNames: 'form-select-medium',
          hideEmptyValueInReview: true,
        },
      },
    },
    ssn: {
      ...ssnUI,
      'ui:title': 'Child’s Social Security number',
      'ui:required': formData =>
        isChapterFieldRequired(
          formData,
          TASK_KEYS.reportChild18OrOlderIsNotAttendingSchool,
        ),
    },
    birthDate: merge(currentOrPastDateUI('Child’s date of birth'), {
      'ui:required': formData =>
        isChapterFieldRequired(
          formData,
          TASK_KEYS.reportChild18OrOlderIsNotAttendingSchool,
        ),
    }),
    dateChildLeftSchool: {
      ...currentOrPastDateUI('When did child stop attending school?'),
      ...{
        'ui:required': formData =>
          isChapterFieldRequired(
            formData,
            TASK_KEYS.reportChild18OrOlderIsNotAttendingSchool,
          ),
      },
    },
    dependentIncome: {
      'ui:options': {
        hideIf: () => environment.isProduction(),
        hideEmptyValueInReview: true,
      },
      'ui:title': PensionIncomeRemovalQuestionTitle,
      'ui:widget': 'yesNo',
    },
  },
};
