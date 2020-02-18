import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import fullNameUI from 'platform/forms/definitions/fullName';

import { genericSchemas } from '../../../generic-schema';

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
    ...fullNameUI,
    first: {
      'ui:title': 'Child’s first name',
    },
    middle: {
      'ui:title': 'Child’s middle name',
    },
    last: {
      'ui:title': 'Child’s last name',
    },
    suffix: {
      'ui:title': 'Child’s suffix',
    },
  },
  dateChildMarried: currentOrPastDateUI('Date of marriage'),
};
