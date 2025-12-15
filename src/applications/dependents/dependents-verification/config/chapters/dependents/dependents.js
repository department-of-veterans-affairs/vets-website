import { radioSchema } from 'platform/forms-system/src/js/web-component-patterns';

import { DEPENDENT_TITLE, DEPENDENT_CHOICES } from '../../../constants';

/** @returns {PageSchema} */
export const dependents = {
  schema: {
    type: 'object',
    properties: {
      dependents: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            fullName: { type: 'string' },
            ssn: { type: 'string' },
            dob: { type: 'string' },
            age: { type: 'number' },
            relationship: { type: 'string' },
          },
        },
      },
      hasDependentsStatusChanged: radioSchema(['Y', 'N']),
    },
  },
  uiSchema: {
    dependents: {
      items: {
        fullName: { 'ui:title': 'First name' },
        ssn: { 'ui:title': 'Social Security number' },
        dob: { 'ui:title': 'Date of birth' },
        age: { 'ui:title': 'Age' },
        relationship: { 'ui:title': 'Relationship' },
      },
    },
    hasDependentsStatusChanged: {
      'ui:title': DEPENDENT_TITLE,
      'ui:options': {
        labels: DEPENDENT_CHOICES,
      },
    },
  },
};
