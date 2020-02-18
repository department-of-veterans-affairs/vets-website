import _ from 'lodash';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import fullNameUI from 'platform/forms/definitions/fullName';
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
  formerSpouseName: _.merge(fullNameUI, {
    first: {
      'ui:title': 'Former spouse’s first name',
    },
    middle: {
      'ui:title': 'Former spouse’s middle name',
    },
    last: {
      'ui:title': 'Former spouse’s last name',
    },
  }),
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
    'ui:options': {
      expandUnder: 'isMarriageAnnulledOrVoid',
    },
  },
};
