import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { validateName } from '../../../utilities';
import { TASK_KEYS } from '../../../constants';
import { genericSchemas } from '../../../generic-schema';
import { isChapterFieldRequired } from '../../../helpers';
import { merge } from 'lodash';

const {
  fullName: formerSpouseName,
  date: dateOfDivorce,
  genericLocation: locationOfDivorce,
} = genericSchemas;

export const schema = {
  type: 'object',
  required: [
    'formerSpouseName',
    'dateOfDivorce',
    'locationOfDivorce',
    'isMarriageAnnulledOrVoid',
  ],
  properties: {
    formerSpouseName,
    dateOfDivorce,
    locationOfDivorce,
    isMarriageAnnulledOrVoid: { type: 'boolean' },
    explanationOfAnnullmentOrVoid: {
      type: 'string',
      maxLength: 500,
      pattern: '^(?!\\s)(?!.*?\\s{2,})[^<>%$#@!^&*]+$',
    },
  },
};

export const uiSchema = {
  formerSpouseName: {
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
  dateOfDivorce: merge(currentOrPastDateUI('Date of divorce'), {
    'ui:required': formData =>
      isChapterFieldRequired(formData, TASK_KEYS.reportDivorce),
  }),
  locationOfDivorce: {
    'ui:title': 'Where did this marriage end?',
    state: {
      'ui:title': 'State (or country if outside USA)',
      'ui:errorMessages': {
        required: 'Please enter a state, or country if outside of USA',
      },
      'ui:required': formData =>
        isChapterFieldRequired(formData, TASK_KEYS.reportDivorce),
    },
    city: {
      'ui:title': 'City or county',
      'ui:errorMessages': {
        required: 'Please enter a city or county',
      },
      'ui:required': formData =>
        isChapterFieldRequired(formData, TASK_KEYS.reportDivorce),
    },
  },
  isMarriageAnnulledOrVoid: {
    'ui:title': 'Was the marriage annulled or declared void?',
    'ui:widget': 'yesNo',
    'ui:errorMessages': {
      required: 'Please select yes or no',
    },
  },
  explanationOfAnnullmentOrVoid: {
    'ui:title': 'Please give a brief explanation',
    'ui:required': formData => formData.isMarriageAnnulledOrVoid,
    'ui:widget': 'textarea',
    'ui:options': { expandUnder: 'isMarriageAnnulledOrVoid' },
  },
};
