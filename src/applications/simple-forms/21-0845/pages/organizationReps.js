import {
  titleUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI(
      'Organization’s representatives',
      'List at least one person from the organization who we can release your information to.',
    ),
    organizationRepresentative: textUI({
      title: 'Name of representative',
      description: 'At least one representative is required',
      errorMessages: {
        required: 'Please enter the name of a representative',
      },
    }),
    organizationRepresentative2: textUI({
      title: 'Name of second representative (if any)',
    }),
  },
  schema: {
    type: 'object',
    required: ['organizationRepresentative'],
    properties: {
      organizationRepresentative: textSchema,
      organizationRepresentative2: textSchema,
    },
  },
};
