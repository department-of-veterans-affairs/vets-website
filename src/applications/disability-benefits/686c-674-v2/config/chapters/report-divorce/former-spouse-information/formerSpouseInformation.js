import merge from 'lodash/merge';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import environment from 'platform/utilities/environment';
import { validateName, reportDivorce } from '../../../utilities';
import { TASK_KEYS } from '../../../constants';
import {
  isChapterFieldRequired,
  PensionIncomeRemovalQuestionTitle,
} from '../../../helpers';
import { locationUISchema } from '../../../location-schema';

export const schema = {
  type: 'object',
  properties: {
    reportDivorce,
  },
};

export const uiSchema = {
  reportDivorce: {
    fullName: {
      'ui:validations': [validateName],
      first: {
        'ui:title': 'Former spouse’s first name',
        'ui:errorMessages': {
          required: 'Enter a first name',
          pattern: 'This field accepts alphabetic characters only',
        },
        'ui:required': formData =>
          isChapterFieldRequired(formData, TASK_KEYS.reportDivorce),
      },
      middle: {
        'ui:title': 'Former spouse’s middle name',
        'ui:options': {
          hideEmptyValueInReview: true,
        },
        'ui:errorMessages': {
          pattern: 'This field accepts alphabetic characters only',
        },
      },
      last: {
        'ui:title': 'Former spouse’s last name',
        'ui:errorMessages': {
          required: 'Enter a last name',
          pattern: 'This field accepts alphabetic characters only',
        },
        'ui:required': formData =>
          isChapterFieldRequired(formData, TASK_KEYS.reportDivorce),
      },
      suffix: {
        'ui:title': 'Former spouse’s suffix',
        'ui:options': {
          widgetClassNames: 'form-select-medium',
          hideIf: () => true,
        },
      },
    },
    ssn: {
      ...ssnUI,
      'ui:title': 'Former spouse’s Social Security number',
      'ui:required': formData =>
        isChapterFieldRequired(formData, TASK_KEYS.reportDivorce),
    },
    birthDate: merge(currentOrPastDateUI('Former spouse’s date of birth'), {
      'ui:required': formData =>
        isChapterFieldRequired(formData, TASK_KEYS.reportDivorce),
    }),
    date: merge(currentOrPastDateUI('Date of divorce'), {
      'ui:required': formData =>
        isChapterFieldRequired(formData, TASK_KEYS.reportDivorce),
    }),
    location: locationUISchema(
      'reportDivorce',
      'location',
      false,
      'Where did this marriage end?',
      TASK_KEYS.reportDivorce,
    ),
    reasonMarriageEnded: {
      'ui:required': formData =>
        isChapterFieldRequired(formData, TASK_KEYS.reportDivorce),
      'ui:title': 'Reason marriage ended',
      'ui:widget': 'radio',
      'ui:errorMessages': {
        required: 'Select an option',
      },
      'ui:options': {
        updateSchema: () => ({
          enumNames: ['Divorce', 'Annulment or other'],
        }),
      },
    },
    explanationOfOther: {
      'ui:title': 'Give a brief explanation',
      'ui:required': formData =>
        formData?.reportDivorce?.reasonMarriageEnded === 'Other',
      'ui:options': {
        expandUnder: 'reasonMarriageEnded',
        expandUnderCondition: 'Other',
      },
    },
    spouseIncome: {
      'ui:options': {
        hideIf: () => environment.isProduction(),
        hideEmptyValueInReview: true,
      },
      'ui:title': PensionIncomeRemovalQuestionTitle,
      'ui:widget': 'yesNo',
    },
  },
};
