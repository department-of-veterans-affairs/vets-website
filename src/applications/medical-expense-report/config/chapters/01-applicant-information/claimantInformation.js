import {
  titleUI,
  fullNameSchema,
  fullNameUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Your name',
      'You aren’t required to fill in all fields, but we can review your application faster if you provide more information.',
    ),
    claimantFullName: {
      ...fullNameUI(),
      first: {
        'ui:title': 'First name',
        'ui:errorMessages': {
          required: 'Enter a first name',
        },
      },
      last: {
        'ui:title': 'Last name',
        'ui:errorMessages': {
          required: 'Enter a last name',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['claimantFullName'],
    properties: {
      claimantFullName: fullNameSchema,
    },
  },
};
