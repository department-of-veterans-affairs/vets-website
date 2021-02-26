import merge from 'lodash/merge';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import { TASK_KEYS } from '../../../constants';
import { validateName, reportChildMarriage } from '../../../utilities';
import {
  isChapterFieldRequired,
  PensionIncomeRemovalQuestionTitle,
} from '../../../helpers';

export const schema = {
  type: 'object',
  properties: {
    childMarriage: reportChildMarriage,
  },
};

export const uiSchema = {
  childMarriage: {
    'ui:title': 'Child who is now married',
    fullName: {
      'ui:validations': [validateName],
      first: {
        'ui:title': 'First name',
        'ui:errorMessages': { required: 'Please enter a first name' },
        'ui:required': formData =>
          isChapterFieldRequired(
            formData,
            TASK_KEYS.reportMarriageOfChildUnder18,
          ),
      },
      middle: { 'ui:title': 'Middle name' },
      last: {
        'ui:title': 'Last name before marriage',
        'ui:errorMessages': { required: 'Please enter a last name' },
        'ui:required': formData =>
          isChapterFieldRequired(
            formData,
            TASK_KEYS.reportMarriageOfChildUnder18,
          ),
      },
      suffix: {
        'ui:title': 'Suffix',
        'ui:options': { widgetClassNames: 'form-select-medium' },
      },
    },
    ssn: {
      ...ssnUI,
      'ui:title': 'Child’s Social Security number',
      'ui:required': formData =>
        isChapterFieldRequired(
          formData,
          TASK_KEYS.reportMarriageOfChildUnder18,
        ),
    },
    birthDate: merge(currentOrPastDateUI('Child’s date of birth'), {
      'ui:required': formData =>
        isChapterFieldRequired(
          formData,
          TASK_KEYS.reportMarriageOfChildUnder18,
        ),
    }),
    dateMarried: merge(currentOrPastDateUI('Date of marriage'), {
      'ui:required': formData =>
        isChapterFieldRequired(
          formData,
          TASK_KEYS.reportMarriageOfChildUnder18,
        ),
    }),
    dependentIncome: {
      'ui:title': PensionIncomeRemovalQuestionTitle,
      'ui:widget': 'yesNo',
    },
  },
};
