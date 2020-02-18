import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { validateName } from '../../../utilities';
import { genericSchemas } from '../../../generic-schema';

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
    },
    middle: { 'ui:title': 'Former spouse’s middle name' },
    last: {
      'ui:title': 'Former spouse’s last name',
      'ui:errorMessages': { required: 'Please enter a last name' },
    },
    suffix: {
      'ui:title': 'Former spouse’s suffix',
      'ui:options': { widgetClassNames: 'form-select-medium' },
    },
  },
  dateOfDivorce: currentOrPastDateUI('Date of divorce'),
  locationOfDivorce: {
    'ui:title': 'Where did this marriage end?',
    state: { 'ui:title': 'State (or country if outside USA)' },
    city: { 'ui:title': 'City or county' },
  },
  isMarriageAnnulledOrVoid: {
    'ui:title': 'Was the marriage annulled or declared void?',
    'ui:widget': 'yesNo',
  },
  explanationOfAnnullmentOrVoid: {
    'ui:title': 'Please give a brief explanation',
    'ui:required': formData => formData.isMarriageAnnulledOrVoid,
    'ui:widget': 'textarea',
    'ui:options': { expandUnder: 'isMarriageAnnulledOrVoid' },
  },
};
