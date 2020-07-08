import merge from 'lodash/merge';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { validateName, reportDivorce } from '../../../utilities';
import { TASK_KEYS } from '../../../constants';
import {
  isChapterFieldRequired,
  stateTitle,
  cityTitle,
} from '../../../helpers';

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
        'ui:errorMessages': { required: 'Please enter a first name' },
        'ui:required': formData =>
          isChapterFieldRequired(formData, TASK_KEYS.reportDivorce),
      },
      middle: { 'ui:title': 'Former spouse’s middle name' },
      last: {
        'ui:title': 'Former spouse’s last name',
        'ui:errorMessages': { required: 'Please enter a last name' },
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
    date: merge(currentOrPastDateUI('Date of divorce'), {
      'ui:required': formData =>
        isChapterFieldRequired(formData, TASK_KEYS.reportDivorce),
    }),
    location: {
      'ui:title': 'Where did this marriage end?',
      state: {
        'ui:title': stateTitle,
        'ui:errorMessages': {
          required: 'Please enter a state, or country if outside of USA',
        },
        'ui:required': formData =>
          isChapterFieldRequired(formData, TASK_KEYS.reportDivorce),
      },
      city: {
        'ui:title': cityTitle,
        'ui:errorMessages': {
          required: 'Please enter a city or county',
        },
        'ui:required': formData =>
          isChapterFieldRequired(formData, TASK_KEYS.reportDivorce),
      },
    },
    reasonMarriageEnded: {
      'ui:required': formData =>
        isChapterFieldRequired(formData, TASK_KEYS.reportDivorce),
      'ui:title': 'Reason marriage ended',
      'ui:widget': 'radio',
      'ui:errorMessages': {
        required: 'Please select yes or no',
      },
      'ui:options': {
        updateSchema: () => ({
          enumNames: ['Divorce', 'Annulment or other'],
        }),
      },
    },
    explanationOfOther: {
      'ui:title': 'Please give a brief explanation',
      'ui:required': formData =>
        formData?.reportDivorce?.reasonMarriageEnded === 'Other',
      'ui:options': {
        expandUnder: 'reasonMarriageEnded',
        expandUnderCondition: 'Other',
      },
    },
  },
};
