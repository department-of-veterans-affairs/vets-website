import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

import { genericSchemas } from '../../../generic-schema';
import { validateName } from '../../../utilities';

const { fullName, date } = genericSchemas;

export const schema = {
  type: 'object',
  required: ['marriedChildName', 'dateChildMarried'],
  properties: {
    marriedChildName: fullName,
    dateChildMarried: date,
  },
};

export const uiSchema = {
  'ui:title': 'Child who is now married',
  marriedChildName: {
    'ui:validations': [validateName],
    first: {
      'ui:title': 'Child’s first name',
      'ui:errorMessages': { required: 'Please enter a first name' },
    },
    middle: { 'ui:title': 'Child’s middle name' },
    last: {
      'ui:title': 'Child’s last name',
      'ui:errorMessages': { required: 'Please enter a last name' },
    },
    suffix: {
      'ui:title': 'Child’s suffix',
      'ui:options': { widgetClassNames: 'form-select-medium' },
    },
  },
  dateChildMarried: currentOrPastDateUI('Date of marriage'),
};
